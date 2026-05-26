export type HeatmapSourceId = "github" | "leetcode" | (string & {});

export interface HeatmapSourceMeta {
  id: HeatmapSourceId;
  label: string;
  color: string;
  enabled: boolean;
}

export interface HeatmapCell {
  date: string;
  counts: Partial<Record<HeatmapSourceId, number>>;
}

export interface HeatmapWeekCell {
  date: string;
  inRange: boolean;
  counts: Partial<Record<HeatmapSourceId, number>>;
}

export type HeatmapWeek = HeatmapWeekCell[];

export interface HeatmapFetchResult {
  cells: HeatmapCell[];
  loadedSourceIds: HeatmapSourceId[];
}

export interface HeatmapSnapshotFile {
  generatedAt: string;
  sources: Record<string, Record<string, number>>;
}
