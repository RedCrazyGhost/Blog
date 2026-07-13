<template>
  <div
    class="heatmap"
    :class="isDark ? 'heatmap--dark' : 'heatmap--light'"
    role="group"
    aria-label="近一年活动热力图"
  >
    <header class="heatmap__header">
      <h2 class="heatmap__title">活动记录</h2>
    </header>

    <div class="heatmap__card">
      <div
        v-if="heatmap.loading && !heatmap.loaded"
        class="heatmap__skeleton-unified"
        aria-hidden="true"
        :style="skeletonGridStyle"
      >
        <div class="heatmap__skeleton-corner" />
        <div class="heatmap__skeleton-months" />
        <span
          v-for="di in 7"
          :key="`sk-day-${di}`"
          class="heatmap__skeleton-day"
          :style="{ gridRow: di + 2 }"
        />
        <template v-for="wi in 53" :key="`sk-week-${wi}`">
          <span
            v-for="di in 7"
            :key="`sk-cell-${wi}-${di}`"
            class="heatmap__skeleton-cell"
            :style="{ gridColumn: wi + 2, gridRow: di + 2 }"
          />
        </template>
      </div>

      <div
        v-else
        class="heatmap__chart"
        :class="{ 'heatmap__chart--empty': !hasActivity }"
      >
        <div class="heatmap__inner">
          <div
            class="heatmap__unified-grid"
            role="grid"
            aria-label="活动日历"
            :style="unifiedGridStyle"
          >
            <div class="heatmap__month-corner" aria-hidden="true" />

            <div class="heatmap__months" aria-hidden="true">
              <span
                v-for="m in monthLabels"
                :key="`${m.weekIndex}-${m.label}`"
                class="heatmap__month"
                :style="monthLabelStyle(m.weekIndex)"
              >
                {{ m.label }}
              </span>
            </div>

            <span
              v-for="(label, di) in dayLabels"
              :key="`day-${di}`"
              class="heatmap__day"
              :class="{ 'heatmap__day--show': showDayLabel(di) }"
              :style="{ gridRow: di + 2 }"
              aria-hidden="true"
            >
              {{ showDayLabel(di) ? label : "" }}
            </span>

            <template v-for="(week, wi) in weeks" :key="wi">
              <button
                v-for="(cell, di) in week"
                :key="`${wi}-${di}`"
                type="button"
                class="heatmap__cell"
                :class="{
                  'heatmap__cell--pad': !cell.inRange,
                  'heatmap__cell--active': cellHasActivity(cell),
                  'heatmap__cell--empty': cell.inRange && !cellHasActivity(cell),
                }"
                role="gridcell"
                :style="cellGridStyle(wi, di, cell)"
                :aria-label="cellAria(cell)"
                :aria-describedby="
                  hoveredCell === cell ? tooltipId : undefined
                "
                :disabled="!cell.inRange"
                :tabindex="cellHasActivity(cell) ? 0 : -1"
                @mouseenter="onCellEnter($event, cell)"
                @mouseleave="onCellLeave"
                @focus="onCellEnter($event, cell)"
                @blur="onCellLeave"
              />
            </template>
          </div>
        </div>

        <p v-if="heatmap.loaded && !hasActivity" class="heatmap__empty">
          暂无活动数据
        </p>

        <Teleport to="body">
          <Transition name="heatmap-tooltip">
            <div
              v-if="hoveredCell && tooltipVisible"
              :id="tooltipId"
              ref="tooltipRef"
              class="heatmap__tooltip"
              :class="isDark ? 'heatmap--dark' : 'heatmap--light'"
              role="tooltip"
              :style="tooltipStyle"
            >
              <p class="heatmap__tooltip-date">
                {{ formatHeatmapDate(hoveredCell.date) }}
              </p>
              <ul class="heatmap__tooltip-sources">
                <li
                  v-for="item in nonSteamTooltipDetails(hoveredCell)"
                  :key="item.id"
                  class="heatmap__tooltip-row"
                >
                  <span
                    class="heatmap__tooltip-swatch"
                    :style="{ backgroundColor: item.color }"
                  />
                  <span class="heatmap__tooltip-name">{{ item.label }}</span>
                  <span class="heatmap__tooltip-count">
                    {{ formatCount(item.count, item.id) }}
                    {{ getHeatmapSourceUnit(item.id) }}
                  </span>
                </li>
              </ul>
              <ul
                v-if="steamGameTooltipDetails(hoveredCell).length"
                class="heatmap__tooltip-games"
              >
                <li class="heatmap__tooltip-games-title">Steam</li>
                <li
                  v-for="game in steamGameTooltipDetails(hoveredCell)"
                  :key="game.appId"
                  class="heatmap__tooltip-row"
                >
                  <span
                    class="heatmap__tooltip-swatch"
                    :style="{ backgroundColor: game.color }"
                  />
                  <span class="heatmap__tooltip-name">{{ game.name }}</span>
                  <span class="heatmap__tooltip-count">
                    {{ formatSteamHours(game.hours) }} 小时
                  </span>
                </li>
              </ul>
            </div>
          </Transition>
        </Teleport>
      </div>

      <footer v-if="heatmap.loaded" class="heatmap__legend">
        <div class="heatmap__legend-sources">
          <template v-for="src in nonSteamSourceMetas" :key="src.id">
            <span class="heatmap__legend-pill">
              <span
                class="heatmap__legend-swatch"
                :style="{ backgroundColor: src.color }"
              />
              <span class="heatmap__legend-pill-label">{{ src.label }}</span>
              <span class="heatmap__legend-pill-unit">
                {{ getHeatmapSourceUnit(src.id) }}
              </span>
            </span>
          </template>
          <span
            v-for="game in activeSteamGames"
            :key="game.appId"
            class="heatmap__legend-pill"
          >
            <span
              class="heatmap__legend-swatch"
              :style="{ backgroundColor: game.color }"
            />
            <span class="heatmap__legend-pill-label">{{ game.name }}</span>
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useHeatmapStore } from "@/stores/Heatmap";
import { useThemeStore } from "@/stores/Theme";
import type { HeatmapSourceId, HeatmapWeekCell } from "@/types/heatmap";
import {
  buildDayLabels,
  buildMonthLabels,
  cellHasActivity,
  formatHeatmapDate,
} from "@/utils/heatmap/axis";
import { getHeatmapSourceUnit } from "@/service/heatmap/registry";
import {
  getCellBackground,
  getCellSourceDetails,
  getSteamGameDetails,
  isGradientBackground,
} from "@/utils/heatmap/color";

const heatmap = useHeatmapStore();
const theme = useThemeStore();
const tooltipRef = ref<HTMLElement | null>(null);
const hoveredCell = ref<HeatmapWeekCell | null>(null);
const tooltipVisible = ref(false);
const tooltipStyle = ref<{
  left: string;
  top: string;
  transform: string;
}>({
  left: "0",
  top: "0",
  transform: "translate(-50%, -100%)",
});

const tooltipId = "heatmap-tooltip";

const weeks = computed(() => heatmap.weeks);
const monthLabels = computed(() => buildMonthLabels(weeks.value));
const dayLabels = buildDayLabels();

function monthLabelStyle(weekIndex: number): { left: string } {
  const count = weeks.value.length;
  if (count <= 0) return { left: "0" };
  return { left: `${(weekIndex / count) * 100}%` };
}

const unifiedGridStyle = computed(() => ({
  gridTemplateColumns: `var(--heatmap-axis-width) repeat(${weeks.value.length}, 1fr)`,
}));

const skeletonGridStyle = {
  gridTemplateColumns: "var(--heatmap-axis-width) repeat(53, 1fr)",
};
const sourceMetas = computed(() => heatmap.activeSourceMetas);
const nonSteamSourceMetas = computed(() =>
  sourceMetas.value.filter((s) => s.id !== "steam"),
);
const activeSteamGames = computed(() => heatmap.activeSteamGames);
const sourceMax = computed(() => heatmap.sourceMax);
const isDark = computed(() => theme.GetThemeColor === "dark");
const hasActivity = computed(() =>
  heatmap.cells.some(
    (cell) =>
      Object.values(cell.counts).some((count) => (count ?? 0) > 0) ||
      (cell.steamGames &&
        Object.values(cell.steamGames).some((hours) => hours > 0)),
  ),
);

onMounted(() => {
  void heatmap.load();
});

function formatSteamHours(hours: number): string {
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

function showDayLabel(dayIndex: number): boolean {
  return dayIndex === 1 || dayIndex === 3 || dayIndex === 5;
}

function formatCount(count: number, id: HeatmapSourceId): string {
  if (id === "steam") return formatSteamHours(count);
  return String(count);
}

function cellStyle(cell: HeatmapWeekCell) {
  if (!cell.inRange) {
    return { backgroundColor: "transparent", visibility: "hidden" as const };
  }
  const bg = getCellBackground(
    { counts: cell.counts, steamGames: cell.steamGames },
    sourceMetas.value,
    sourceMax.value,
    heatmap.steamGameMax,
    heatmap.steamGameColors,
  );
  if (isGradientBackground(bg)) {
    return { background: bg, backgroundColor: "var(--heatmap-empty)" };
  }
  return { backgroundColor: bg };
}

function cellGridStyle(
  weekIndex: number,
  dayIndex: number,
  cell: HeatmapWeekCell,
) {
  return {
    gridColumn: weekIndex + 2,
    gridRow: dayIndex + 2,
    ...cellStyle(cell),
  };
}

function nonSteamTooltipDetails(cell: HeatmapWeekCell) {
  return getCellSourceDetails(cell.counts, sourceMetas.value).filter(
    (d) => d.id !== "steam",
  );
}

function steamGameTooltipDetails(cell: HeatmapWeekCell) {
  if (!cell.steamGames) return [];
  return getSteamGameDetails(
    cell.steamGames,
    heatmap.steamGameNames,
    heatmap.steamGameMax,
    heatmap.steamGameColors,
  );
}

function cellAria(cell: HeatmapWeekCell): string | undefined {
  if (!cell.inRange) return undefined;
  const details = nonSteamTooltipDetails(cell);
  const games = steamGameTooltipDetails(cell);
  if (details.length === 0 && games.length === 0) {
    return `${formatHeatmapDate(cell.date)}，无活动`;
  }
  const parts = details.map(
    (d) =>
      `${d.label} ${formatCount(d.count, d.id)} ${getHeatmapSourceUnit(d.id)}`,
  );
  for (const game of games) {
    parts.push(`${game.name} ${formatSteamHours(game.hours)} 小时`);
  }
  return `${formatHeatmapDate(cell.date)}，${parts.join("，")}`;
}

function updateTooltipPosition(target: HTMLElement) {
  const tooltip = tooltipRef.value;
  if (!tooltip) return;

  const pad = 8;
  const gap = 8;
  const cellRect = target.getBoundingClientRect();
  const { width: tw, height: th } = tooltip.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const anchorX = cellRect.left + cellRect.width / 2;
  let left = anchorX;
  let tx = "-50%";

  if (anchorX + tw / 2 > vw - pad) {
    left = Math.min(vw - pad, cellRect.right);
    tx = "-100%";
  } else if (anchorX - tw / 2 < pad) {
    left = Math.max(pad, cellRect.left);
    tx = "0";
  }

  let top = cellRect.top - gap;
  let ty = "-100%";

  if (top - th < pad) {
    top = cellRect.bottom + gap;
    ty = "0";
  }

  tooltipStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    transform: `translate(${tx}, ${ty})`,
  };
}

async function onCellEnter(event: Event, cell: HeatmapWeekCell) {
  if (!cellHasActivity(cell)) {
    onCellLeave();
    return;
  }
  hoveredCell.value = cell;
  tooltipVisible.value = true;

  const target = event.currentTarget as HTMLElement;
  if (!target) return;

  await nextTick();
  updateTooltipPosition(target);
}

function onCellLeave() {
  hoveredCell.value = null;
  tooltipVisible.value = false;
}
</script>

<style scoped>
.heatmap {
  --heatmap-empty: #ebedf0;
  --heatmap-gap: 3px;
  --heatmap-axis-width: 1.5rem;
  --heatmap-months-height: 1.25rem;
  --heatmap-cell-radius: 3px;
  width: 100%;
}

.heatmap--dark {
  --heatmap-empty: #161b22;
  --heatmap-axis: rgba(230, 237, 243, 0.55);
  --heatmap-card-border: rgba(255, 255, 255, 0.12);
  --heatmap-card-bg: rgba(255, 255, 255, 0.03);
  --heatmap-hint: rgba(230, 237, 243, 0.5);
  --heatmap-pill-bg: rgba(255, 255, 255, 0.06);
  --heatmap-pill-border: rgba(255, 255, 255, 0.1);
  --heatmap-skeleton: rgba(255, 255, 255, 0.08);
  --heatmap-tooltip-bg: #21262d;
  --heatmap-tooltip-border: rgba(255, 255, 255, 0.12);
  --heatmap-tooltip-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  --heatmap-tooltip-text: #e6edf3;
  --heatmap-tooltip-text-muted: rgba(230, 237, 243, 0.75);
  --heatmap-hover-ring: rgba(230, 237, 243, 0.85);
}

.heatmap--light {
  --heatmap-axis: rgba(33, 37, 41, 0.55);
  --heatmap-card-border: rgba(0, 0, 0, 0.1);
  --heatmap-card-bg: rgba(0, 0, 0, 0.02);
  --heatmap-hint: rgba(33, 37, 41, 0.5);
  --heatmap-pill-bg: rgba(0, 0, 0, 0.03);
  --heatmap-pill-border: rgba(0, 0, 0, 0.08);
  --heatmap-skeleton: rgba(0, 0, 0, 0.06);
  --heatmap-tooltip-bg: #fff;
  --heatmap-tooltip-border: rgba(0, 0, 0, 0.1);
  --heatmap-tooltip-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  --heatmap-tooltip-text: #212529;
  --heatmap-tooltip-text-muted: rgba(33, 37, 41, 0.75);
  --heatmap-hover-ring: rgba(33, 37, 41, 0.55);
}

.heatmap__header {
  margin-bottom: 1rem;
}

.heatmap__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
}

.heatmap__card {
  border: 2px solid var(--heatmap-card-border);
  border-radius: 0.75rem;
  background: var(--heatmap-card-bg);
  padding: 1rem 1rem 0.875rem;
}

.heatmap__skeleton-unified {
  display: grid;
  width: 100%;
  gap: var(--heatmap-gap);
  grid-template-rows: var(--heatmap-months-height) repeat(7, auto);
  min-height: 8.5rem;
}

.heatmap__skeleton-corner {
  grid-column: 1;
  grid-row: 1;
  border-radius: 4px;
  background: var(--heatmap-skeleton);
  animation: heatmap-pulse 1.4s ease-in-out infinite;
}

.heatmap__skeleton-months {
  grid-column: 2 / -1;
  grid-row: 1;
  border-radius: 4px;
  background: var(--heatmap-skeleton);
  animation: heatmap-pulse 1.4s ease-in-out infinite;
}

.heatmap__skeleton-day {
  grid-column: 1;
  align-self: center;
  height: 0.5rem;
  border-radius: 2px;
  background: var(--heatmap-skeleton);
  animation: heatmap-pulse 1.4s ease-in-out infinite;
}

.heatmap__skeleton-cell {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--heatmap-cell-radius);
  background: var(--heatmap-skeleton);
  animation: heatmap-pulse 1.4s ease-in-out infinite;
}

.heatmap__chart {
  position: relative;
  width: 100%;
}

.heatmap__inner {
  width: 100%;
  overflow: hidden;
}

.heatmap__unified-grid {
  display: grid;
  width: 100%;
  gap: var(--heatmap-gap);
  grid-template-rows: var(--heatmap-months-height) repeat(7, auto);
  min-width: 0;
}

.heatmap__month-corner {
  grid-column: 1;
  grid-row: 1;
}

.heatmap__months {
  grid-column: 2 / -1;
  grid-row: 1;
  position: relative;
  overflow: visible;
  min-width: 0;
}

.heatmap__month {
  position: absolute;
  top: 0;
  font-size: 0.6875rem;
  line-height: var(--heatmap-months-height);
  color: var(--heatmap-axis);
  white-space: nowrap;
  pointer-events: none;
}

.heatmap__day {
  grid-column: 1;
  font-size: 0.6875rem;
  line-height: 1;
  color: var(--heatmap-axis);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 4px;
  opacity: 0;
  user-select: none;
  box-sizing: border-box;
  align-self: center;
}

.heatmap__day--show {
  opacity: 1;
}

.heatmap__cell {
  width: 100%;
  aspect-ratio: 1;
  min-width: 0;
  border-radius: var(--heatmap-cell-radius);
  border: none;
  padding: 0;
  cursor: default;
  display: block;
  transition:
    transform 0.12s ease,
    outline-color 0.12s ease,
    box-shadow 0.12s ease;
}

.heatmap__cell--empty {
  background-color: var(--heatmap-empty);
}

.heatmap__cell--active {
  cursor: pointer;
}

.heatmap__cell--active:hover,
.heatmap__cell--active:focus-visible {
  transform: scale(1.2);
  outline: 2px solid var(--heatmap-hover-ring);
  outline-offset: 1px;
  box-shadow: 0 0 0 1px var(--heatmap-empty);
  z-index: 1;
  position: relative;
}

.heatmap__cell--pad {
  pointer-events: none;
}

.heatmap__empty {
  margin: 0.75rem 0 0;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--heatmap-hint);
}

.heatmap__tooltip {
  position: fixed;
  z-index: 50;
  pointer-events: none;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  font-size: 0.75rem;
  line-height: 1.45;
  white-space: nowrap;
  color: var(--heatmap-tooltip-text);
  background: var(--heatmap-tooltip-bg);
  border: 1px solid var(--heatmap-tooltip-border);
  box-shadow: var(--heatmap-tooltip-shadow);
}

.heatmap-tooltip-enter-active,
.heatmap-tooltip-leave-active {
  transition: opacity 0.12s ease;
}

.heatmap-tooltip-enter-from,
.heatmap-tooltip-leave-to {
  opacity: 0;
}

.heatmap__tooltip-date {
  font-weight: 600;
  margin: 0 0 0.35rem;
}

.heatmap__tooltip-sources {
  list-style: none;
  margin: 0;
  padding: 0;
}

.heatmap__tooltip-games {
  list-style: none;
  margin: 0.35rem 0 0;
  padding: 0.35rem 0 0;
  border-top: 1px solid var(--heatmap-tooltip-border);
}

.heatmap__tooltip-games-title {
  margin: 0 0 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--heatmap-tooltip-text-muted);
}

.heatmap__tooltip-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.4rem 0.5rem;
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
}

.heatmap__tooltip-row + .heatmap__tooltip-row {
  margin-top: 0.2rem;
}

.heatmap__tooltip-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.heatmap__tooltip-name {
  color: var(--heatmap-tooltip-text-muted);
}

.heatmap__tooltip-count {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.heatmap__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 0.875rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--heatmap-card-border);
}

.heatmap__legend-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.heatmap__legend-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--heatmap-pill-border);
  background: var(--heatmap-pill-bg);
  font-size: 0.75rem;
  line-height: 1.2;
}

.heatmap__legend-pill-label {
  font-weight: 500;
}

.heatmap__legend-pill-unit {
  font-size: 0.6875rem;
  color: var(--heatmap-hint);
}

.heatmap__legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

@keyframes heatmap-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

@media (max-width: 480px) {
  .heatmap {
    --heatmap-gap: 2px;
    --heatmap-axis-width: 1.25rem;
  }

  .heatmap__card {
    padding: 0.75rem 0.625rem 0.625rem;
  }
}
</style>
