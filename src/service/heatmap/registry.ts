import { config } from "@/config";
import type { HeatmapSourceId, HeatmapSourceMeta } from "@/types/heatmap";

const SOURCE_LABELS: Record<string, string> = {
  github: "GitHub",
  leetcode: "力扣",
};

const HEATMAP_UNIT = "次提交";

export function getHeatmapSourceUnit(): string {
  return HEATMAP_UNIT;
}

/** 热力图数据源展示配置（数据由 Action 写入 JSON） */
export function getHeatmapSourceMetas(): HeatmapSourceMeta[] {
  const entries = Object.entries(config.heatmap.sources) as [
    HeatmapSourceId,
    { enabled: boolean; color: string },
  ][];
  return entries
    .filter(([, s]) => s.enabled)
    .map(([id, s]) => ({
      id,
      label: SOURCE_LABELS[id] ?? id,
      color: s.color,
      enabled: s.enabled,
    }));
}
