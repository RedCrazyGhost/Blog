import { loadHeatmapSnapshot } from "@/service/heatmap/staticSnapshot";
import type { HeatmapFetchResult } from "@/types/heatmap";

export type { HeatmapFetchResult };

/** 从 GitHub raw CDN（或本地 JSON 回退）加载热力图 */
export async function fetchAndMergeHeatmap(): Promise<HeatmapFetchResult> {
  return loadHeatmapSnapshot();
}
