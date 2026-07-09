import type { HeatmapWeek, HeatmapWeekCell } from "@/types/heatmap";
import { parseLocalDate } from "@/utils/heatmap/date";

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"] as const;

const WEEKDAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export interface MonthLabel {
  weekIndex: number;
  label: string;
}

export function buildDayLabels(): readonly string[] {
  return WEEKDAY_LABELS;
}

/** 每月首次出现的周列位置（用于绝对定位，不限制在单列宽度内） */
export function buildMonthLabels(weeks: HeatmapWeek[]): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const anchor = week.find((c) => c.inRange);
    if (!anchor) return;

    const month = parseLocalDate(anchor.date).getMonth();
    if (month !== lastMonth) {
      labels.push({ weekIndex, label: `${month + 1}月` });
      lastMonth = month;
    }
  });

  return filterVisibleMonthLabels(labels, weeks.length);
}

/** 过滤水平间距过近的月份，避免标签文字互相遮挡 */
export function filterVisibleMonthLabels(
  labels: MonthLabel[],
  weekCount: number,
): MonthLabel[] {
  if (labels.length === 0 || weekCount <= 0) return labels;

  const minGap = Math.max(3, Math.floor(weekCount / 13));
  const visible: MonthLabel[] = [];
  let lastIndex = -minGap;

  for (const item of labels) {
    if (item.weekIndex - lastIndex >= minGap) {
      visible.push(item);
      lastIndex = item.weekIndex;
    }
  }

  return visible;
}

export function formatHeatmapDate(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = WEEKDAY_NAMES[d.getDay()];
  return `${y}年${m}月${day}日 ${weekday}`;
}

export function cellHasActivity(cell: HeatmapWeekCell): boolean {
  if (!cell.inRange) return false;
  if (Object.values(cell.counts).some((n) => n != null && n > 0)) return true;
  return Object.values(cell.steamGames ?? {}).some((h) => h > 0);
}
