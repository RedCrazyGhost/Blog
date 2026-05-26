import { loadHeatmapSnapshot } from "@/service/heatmap/staticSnapshot";
import type { HeatmapFetchResult } from "@/types/heatmap";

export type { HeatmapFetchResult };

/** 从仓库内静态 JSON 加载热力图（由每日 Action 维护） */
export async function fetchAndMergeHeatmap(): Promise<HeatmapFetchResult> {
  return loadHeatmapSnapshot();
}
