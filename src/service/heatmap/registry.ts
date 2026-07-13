import { config } from "@/config";
import type { HeatmapSourceId, HeatmapSourceMeta } from "@/types/heatmap";

const SOURCE_LABELS: Record<string, string> = {
  github: "GitHub",
  leetcode: "力扣",
  steam: "Steam",
};

const DEFAULT_UNIT = "提交次数";

export function getHeatmapSourceUnit(id?: HeatmapSourceId): string {
  if (!id) return DEFAULT_UNIT;
  const source = config.heatmap.sources[id as keyof typeof config.heatmap.sources];
  if (source && "unit" in source && source.unit) {
    return source.unit;
  }
  return DEFAULT_UNIT;
}

/** 热力图数据源展示配置（数据由 Action 写入 JSON） */
export function getHeatmapSourceMetas(): HeatmapSourceMeta[] {
  const entries = Object.entries(config.heatmap.sources) as [
    HeatmapSourceId,
    { enabled: boolean; color: string; unit?: string },
  ][];
  return entries
    .filter(([, s]) => s.enabled)
    .map(([id, s]) => ({
      id,
      label: SOURCE_LABELS[id] ?? id,
      color: s.color,
      enabled: s.enabled,
      unit: s.unit,
    }));
}
