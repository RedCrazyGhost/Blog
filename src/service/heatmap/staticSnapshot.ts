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

function snapshotUrl(): string {
  const base = import.meta.env.BASE_URL || "/";
  const path = config.heatmap.snapshotPath.replace(/^\//, "");
  return `${base}${path}`;
}

function recordToMap(record: Record<string, number>): Map<string, number> {
  return new Map(
    Object.entries(record).filter(([, count]) => count > 0),
  );
}

/** 读取仓库内 activity-heatmap.json（由每日 Action 维护） */
export async function loadHeatmapSnapshot(): Promise<HeatmapFetchResult> {
  try {
    const res = await fetch(snapshotUrl(), { cache: "default" });
    if (!res.ok) {
      return EMPTY_RESULT;
    }
    const data = (await res.json()) as HeatmapSnapshotFile;
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

    logger.log(
      `Heatmap data loaded (${data.generatedAt}), sources:`,
      loadedSourceIds.join(", "),
    );

    return {
      cells: buildCellsFromMaps(maps),
      loadedSourceIds,
    };
  } catch (err) {
    logger.warn("Heatmap data unavailable:", err);
    return EMPTY_RESULT;
  }
}
