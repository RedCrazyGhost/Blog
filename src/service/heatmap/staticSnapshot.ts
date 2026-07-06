import { config } from "@/config";
import type {
  HeatmapFetchResult,
  HeatmapSnapshotFile,
  HeatmapSourceId,
} from "@/types/heatmap";
import { buildCellsFromMaps } from "@/utils/heatmap/grid";
import { logger } from "@/utils/logger";

const EMPTY_RESULT: HeatmapFetchResult = {
  cells: [],
  loadedSourceIds: [],
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

function parseSnapshotFile(data: HeatmapSnapshotFile): HeatmapFetchResult {
  if (!data?.sources || typeof data.sources !== "object") {
    return EMPTY_RESULT;
  }

  const maps = new Map<string, Map<string, number>>();
  const loadedSourceIds: HeatmapSourceId[] = [];

  for (const [id, record] of Object.entries(data.sources)) {
    const map = recordToMap(record ?? {});
    if (map.size > 0) {
      maps.set(id, map);
      loadedSourceIds.push(id);
    }
  }

  if (loadedSourceIds.length === 0) {
    return EMPTY_RESULT;
  }

  return {
    cells: buildCellsFromMaps(maps),
    loadedSourceIds,
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
