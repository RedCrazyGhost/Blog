import type { HeatmapCell } from "@/types/heatmap";

export function colorForAppId(appId: string): string {
  let hash = 0;
  for (let i = 0; i < appId.length; i++) {
    hash = (hash * 31 + appId.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}

export function buildSteamGameColors(
  appIds: string[],
): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const appId of appIds) {
    colors[appId] = colorForAppId(appId);
  }
  return colors;
}

export function getActiveSteamAppIds(cells: HeatmapCell[]): string[] {
  const active = new Set<string>();
  for (const cell of cells) {
    if (!cell.steamGames) continue;
    for (const [appId, hours] of Object.entries(cell.steamGames)) {
      if (hours > 0) active.add(appId);
    }
  }
  return [...active];
}
