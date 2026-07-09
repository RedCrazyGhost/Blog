import { config } from "@/config";
import type {
  HeatmapFetchResult,
  HeatmapSnapshotFile,
  HeatmapSourceId,
  SteamSourceData,
} from "@/types/heatmap";
import { buildCellsFromMaps } from "@/utils/heatmap/grid";
import { computeSteamGameMax } from "@/utils/heatmap/color";
import { logger } from "@/utils/logger";

const EMPTY_RESULT: HeatmapFetchResult = {
  cells: [],
  loadedSourceIds: [],
  steamGameNames: {},
  steamGameMax: {},
};

function localSnapshotUrl(): string {
  const base = import.meta.env.BASE_URL || "/";
  const path = config.heatmap.snapshotPath.replace(/^\//, "");
  return `${base}${path}`;
}

function recordToMap(record: Record<string, number>): Map<string, number> {
  return new Map(
    Object.entries(record).filter(([, count]) => count > 0),
  );
}

function isSteamSourceData(value: unknown): value is SteamSourceData {
  return (
    value != null &&
    typeof value === "object" &&
    "days" in value &&
    typeof (value as SteamSourceData).days === "object"
  );
}

function steamToAggregateMap(
  steam: SteamSourceData,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const [date, gameHours] of Object.entries(steam.days)) {
    const total = Object.values(gameHours).reduce((sum, h) => sum + h, 0);
    if (total > 0) map.set(date, total);
  }
  return map;
}

function parseSnapshotFile(data: HeatmapSnapshotFile): HeatmapFetchResult {
  if (!data?.sources || typeof data.sources !== "object") {
    return EMPTY_RESULT;
  }

  const maps = new Map<string, Map<string, number>>();
  const loadedSourceIds: HeatmapSourceId[] = [];
  let steamSource: SteamSourceData | null = null;

  for (const [id, record] of Object.entries(data.sources)) {
    if (id === "steam" && isSteamSourceData(record)) {
      const map = steamToAggregateMap(record);
      if (map.size > 0) {
        maps.set(id, map);
        loadedSourceIds.push(id);
        steamSource = record;
      }
      continue;
    }

    if (record && typeof record === "object" && !("days" in record)) {
      const map = recordToMap(record as Record<string, number>);
      if (map.size > 0) {
        maps.set(id, map);
        loadedSourceIds.push(id);
      }
    }
  }

  if (loadedSourceIds.length === 0) {
    return EMPTY_RESULT;
  }

  const steamDays = steamSource
    ? new Map(Object.entries(steamSource.days))
    : undefined;

  const cells = buildCellsFromMaps(maps, undefined, steamDays);
  const steamGameNames = steamSource?.games ?? {};
  const steamGameMax = steamSource
    ? computeSteamGameMax(steamSource.days)
    : {};

  return {
    cells,
    loadedSourceIds,
    steamGameNames,
    steamGameMax,
  };
}

async function fetchSnapshotFrom(
  url: string,
  cache: RequestCache,
): Promise<HeatmapFetchResult | null> {
  const res = await fetch(url, { cache });
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as HeatmapSnapshotFile;
  const result = parseSnapshotFile(data);
  if (result.loadedSourceIds.length === 0) {
    return null;
  }

  logger.log(
    `Heatmap data loaded (${data.generatedAt}) from ${url}, sources:`,
    result.loadedSourceIds.join(", "),
  );

  return result;
}

/** 优先远程 CDN（GitHub raw → jsDelivr），失败时回退本地 activity-heatmap.json */
export async function loadHeatmapSnapshot(): Promise<HeatmapFetchResult> {
  const candidates: Array<{ url: string; cache: RequestCache }> = [];

  if (config.heatmap.remoteEnabled) {
    for (const url of config.heatmap.remoteSnapshotUrls) {
      candidates.push({ url, cache: "no-store" });
    }
  }

  candidates.push({
    url: localSnapshotUrl(),
    cache: "default",
  });

  for (const { url, cache } of candidates) {
    try {
      const result = await fetchSnapshotFrom(url, cache);
      if (result) {
        return result;
      }
    } catch (err) {
      logger.warn(`Heatmap fetch failed (${url}):`, err);
    }
  }

  logger.warn("Heatmap data unavailable from all sources");
  return EMPTY_RESULT;
}
