import type { HeatmapSourceId, HeatmapSourceMeta } from "@/types/heatmap";
import { colorForAppId } from "@/utils/heatmap/steam";

export type SourceMaxCounts = Partial<Record<HeatmapSourceId, number>>;

const HEATMAP_EMPTY = "var(--heatmap-empty)";

export interface CellSourceDetail {
  id: HeatmapSourceId;
  label: string;
  color: string;
  count: number;
}

export interface SteamGameDetail {
  appId: string;
  name: string;
  hours: number;
  color: string;
}

export interface CellColorInput {
  counts: Partial<Record<HeatmapSourceId, number>>;
  steamGames?: Record<string, number>;
}

interface GradientSegment {
  color: string;
  weight: number;
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

/** 从中心按权重比例切分 360° 圆锥渐变 */
function buildConicGradient(segments: GradientSegment[]): string {
  const valid = segments.filter((s) => s.weight > 0);
  if (valid.length === 0) return HEATMAP_EMPTY;
  if (valid.length === 1) return valid[0].color;

  const total = valid.reduce((sum, s) => sum + s.weight, 0);
  const stops: string[] = [];
  let cursor = 0;

  for (const seg of valid) {
    const start = cursor;
    cursor += (seg.weight / total) * 360;
    stops.push(`${seg.color} ${start}deg ${cursor}deg`);
  }

  return `conic-gradient(from 0deg, ${stops.join(", ")})`;
}

export function isGradientBackground(bg: string): boolean {
  return bg.startsWith("linear-gradient") || bg.startsWith("conic-gradient");
}

export function computeSteamGameMax(
  days: Record<string, Record<string, number>>,
): Record<string, number> {
  const max: Record<string, number> = {};
  for (const gameHours of Object.values(days)) {
    for (const [appId, hours] of Object.entries(gameHours)) {
      if (hours > (max[appId] ?? 0)) {
        max[appId] = hours;
      }
    }
  }
  return max;
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
      if (id === "steam") continue;
      const c = cell.counts[id] ?? 0;
      if (c > (max[id] ?? 0)) {
        max[id] = c;
      }
    }
  }
  return max;
}

export function getCellBackground(
  input: CellColorInput,
  sources: HeatmapSourceMeta[],
  sourceMax: SourceMaxCounts,
  steamGameMax: Record<string, number> = {},
  steamGameColors: Record<string, string> = {},
): string {
  const { counts, steamGames } = input;
  const segments: GradientSegment[] = [];

  for (const source of sources) {
    if (source.id === "steam") {
      if (!steamGames) continue;
      const games = Object.entries(steamGames)
        .filter(([, hours]) => hours > 0)
        .sort((a, b) => b[1] - a[1]);
      for (const [appId, hours] of games) {
        const level = activityLevel(hours, steamGameMax[appId] ?? hours);
        const baseColor =
          steamGameColors[appId] ?? colorForAppId(appId);
        segments.push({
          color: tintSourceColor(baseColor, level),
          weight: hours,
        });
      }
      continue;
    }

    const count = counts[source.id] ?? 0;
    if (count <= 0) continue;
    const max = sourceMax[source.id] ?? count;
    const level = activityLevel(count, max);
    segments.push({
      color: tintSourceColor(source.color, level),
      weight: count,
    });
  }

  return buildConicGradient(segments);
}

export function getCellSourceDetails(
  counts: Partial<Record<HeatmapSourceId, number>>,
  sources: HeatmapSourceMeta[],
  steamGames?: Record<string, number>,
): CellSourceDetail[] {
  return sources
    .filter((s) => {
      if (s.id === "steam") {
        return steamGames && Object.keys(steamGames).length > 0;
      }
      return (counts[s.id] ?? 0) > 0;
    })
    .map((s) => {
      if (s.id === "steam" && steamGames) {
        const total = Object.values(steamGames).reduce((sum, h) => sum + h, 0);
        return {
          id: s.id,
          label: s.label,
          color: s.color,
          count: total,
        };
      }
      return {
        id: s.id,
        label: s.label,
        color: s.color,
        count: counts[s.id] ?? 0,
      };
    });
}

export function getSteamGameDetails(
  gameHours: Record<string, number>,
  gameNames: Record<string, string>,
  gameMax: Record<string, number>,
  steamGameColors: Record<string, string>,
): SteamGameDetail[] {
  return Object.entries(gameHours)
    .filter(([, hours]) => hours > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([appId, hours]) => {
      const level = activityLevel(hours, gameMax[appId] ?? hours);
      const baseColor =
        steamGameColors[appId] ?? colorForAppId(appId);
      return {
        appId,
        name: gameNames[appId] ?? appId,
        hours,
        color: tintSourceColor(baseColor, level),
      };
    });
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

