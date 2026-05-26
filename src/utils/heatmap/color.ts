import type { HeatmapSourceId, HeatmapSourceMeta } from "@/types/heatmap";

export type SourceMaxCounts = Partial<Record<HeatmapSourceId, number>>;

const HEATMAP_EMPTY = "var(--heatmap-empty)";

export interface CellSourceDetail {
  id: HeatmapSourceId;
  label: string;
  color: string;
  count: number;
}

function activityLevel(count: number, max: number): number {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function tintSourceColor(baseColor: string, level: number): string {
  if (level <= 0) return HEATMAP_EMPTY;
  const pct = Math.round((level / 4) * 100);
  return `color-mix(in srgb, ${baseColor} ${pct}%, ${HEATMAP_EMPTY})`;
}

export function computeSourceMax(
  cells: { counts: Partial<Record<HeatmapSourceId, number>> }[],
  sourceIds: HeatmapSourceId[],
): SourceMaxCounts {
  const max: SourceMaxCounts = {};
  for (const id of sourceIds) {
    max[id] = 0;
  }
  for (const cell of cells) {
    for (const id of sourceIds) {
      const c = cell.counts[id] ?? 0;
      if (c > (max[id] ?? 0)) {
        max[id] = c;
      }
    }
  }
  return max;
}

export function getCellBackground(
  counts: Partial<Record<HeatmapSourceId, number>>,
  sources: HeatmapSourceMeta[],
  sourceMax: SourceMaxCounts,
): string {
  const active = sources.filter((s) => (counts[s.id] ?? 0) > 0);
  if (active.length === 0) {
    return "var(--heatmap-empty)";
  }

  const tinted = active.map((s) => {
    const count = counts[s.id] ?? 0;
    const max = sourceMax[s.id] ?? count;
    const level = activityLevel(count, max);
    return {
      meta: s,
      count,
      color: tintSourceColor(s.color, level),
    };
  });

  if (tinted.length === 1) {
    return tinted[0].color;
  }

  // 与图例一致：多源均分左右色块，不做 color-mix 混色
  const stops: string[] = [];
  for (let i = 0; i < tinted.length; i++) {
    const start = (i / tinted.length) * 100;
    const end = ((i + 1) / tinted.length) * 100;
    stops.push(`${tinted[i].color} ${start}%`, `${tinted[i].color} ${end}%`);
  }
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

export function getCellSourceDetails(
  counts: Partial<Record<HeatmapSourceId, number>>,
  sources: HeatmapSourceMeta[],
): CellSourceDetail[] {
  return sources
    .filter((s) => (counts[s.id] ?? 0) > 0)
    .map((s) => ({
      id: s.id,
      label: s.label,
      color: s.color,
      count: counts[s.id] ?? 0,
    }));
}

export function getCellTotalCount(
  counts: Partial<Record<HeatmapSourceId, number>>,
): number {
  let total = 0;
  for (const n of Object.values(counts)) {
    total += n ?? 0;
  }
  return total;
}
