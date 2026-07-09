export type HeatmapSourceId = "github" | "leetcode" | (string & {});

export interface SteamSourceData {
  games: Record<string, string>;
  days: Record<string, Record<string, number>>;
}

export interface HeatmapSourceMeta {
  id: HeatmapSourceId;
  label: string;
  color: string;
  enabled: boolean;
  unit?: string;
}

export interface HeatmapCell {
  date: string;
  counts: Partial<Record<HeatmapSourceId, number>>;
  /** 当日各 Steam 游戏游玩时长（小时） */
  steamGames?: Record<string, number>;
}

export interface HeatmapWeekCell {
  date: string;
  inRange: boolean;
  counts: Partial<Record<HeatmapSourceId, number>>;
  steamGames?: Record<string, number>;
}

export type HeatmapWeek = HeatmapWeekCell[];

export interface HeatmapFetchResult {
  cells: HeatmapCell[];
  loadedSourceIds: HeatmapSourceId[];
  steamGameNames: Record<string, string>;
  steamGameMax: Record<string, number>;
}

export interface SteamLegendGame {
  appId: string;
  name: string;
  color: string;
  totalHours: number;
}

export interface HeatmapSnapshotFile {
  generatedAt: string;
  sources: Record<string, Record<string, number> | SteamSourceData>;
}
