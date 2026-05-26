import type { HeatmapCell, HeatmapWeek } from "@/types/heatmap";
import {
  buildLastNDates,
  formatLocalDate,
  parseLocalDate,
} from "@/utils/heatmap/date";

const HEATMAP_DAYS = 365;

export function buildCellsFromMaps(
  maps: Map<string, Map<string, number>>,
  dates: string[] = buildLastNDates(HEATMAP_DAYS),
): HeatmapCell[] {
  return dates.map((date) => {
    const counts: HeatmapCell["counts"] = {};
    for (const [sourceId, dayMap] of maps) {
      const count = dayMap.get(date);
      if (count != null && count > 0) {
        counts[sourceId] = count;
      }
    }
    return { date, counts };
  });
}

/** 周日为行首，列为周（与 GitHub 贡献图一致） */
export function buildWeeks(
  cells: HeatmapCell[],
  dates: string[] = buildLastNDates(HEATMAP_DAYS),
): HeatmapWeek[] {
  if (dates.length === 0) return [];

  const dateSet = new Set(dates);
  const countsByDate = new Map(cells.map((c) => [c.date, c.counts]));
  const first = parseLocalDate(dates[0]);
  const last = parseLocalDate(dates[dates.length - 1]);

  const gridStart = new Date(first);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const weeks: HeatmapWeek[] = [];
  const cursor = new Date(gridStart);

  while (cursor <= last || cursor.getDay() !== 0) {
    const week: HeatmapWeek = [];
    for (let day = 0; day < 7; day++) {
      const dateStr = formatLocalDate(cursor);
      const inRange = dateSet.has(dateStr);
      week.push({
        date: dateStr,
        inRange,
        counts: inRange ? (countsByDate.get(dateStr) ?? {}) : {},
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    if (cursor > last && cursor.getDay() === 0) break;
  }

  return weeks;
}

export { HEATMAP_DAYS };
