<template>
  <div
    class="heatmap"
    :class="isDark ? 'heatmap--dark' : 'heatmap--light'"
    role="group"
    aria-label="近一年活动热力图"
  >
    <div class="heatmap__chart">
      <div class="heatmap__inner">
        <div class="heatmap__body">
          <div class="heatmap__days-col" aria-hidden="true">
            <div class="heatmap__days-gap" />
            <div class="heatmap__days-labels">
              <span
                v-for="(label, di) in dayLabels"
                :key="di"
                class="heatmap__day"
                :class="{ 'heatmap__day--show': showDayLabel(di) }"
              >
                {{ showDayLabel(di) ? label : "" }}
              </span>
            </div>
          </div>

          <div class="heatmap__main">
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

            <div class="heatmap__grid" role="grid" aria-label="活动日历">
              <div
                v-for="(week, wi) in weeks"
                :key="wi"
                class="heatmap__week"
                role="row"
              >
                <button
                  v-for="(cell, di) in week"
                  :key="`${wi}-${di}`"
                  type="button"
                  class="heatmap__cell"
                  :class="{
                    'heatmap__cell--pad': !cell.inRange,
                    'heatmap__cell--active': cellHasActivity(cell),
                  }"
                  role="gridcell"
                  :style="cellStyle(cell)"
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Teleport to="body">
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
              v-for="item in tooltipDetails(hoveredCell)"
              :key="item.id"
              class="heatmap__tooltip-row"
            >
              <span
                class="heatmap__tooltip-swatch"
                :style="{ backgroundColor: item.color }"
              />
              <span class="heatmap__tooltip-name">{{ item.label }}</span>
              <span class="heatmap__tooltip-count">
                {{ item.count }} {{ getHeatmapSourceUnit() }}
              </span>
            </li>
          </ul>
          <p
            v-if="tooltipDetails(hoveredCell).length > 1"
            class="heatmap__tooltip-total"
          >
            共 {{ tooltipTotal(hoveredCell) }} 次提交
          </p>
        </div>
      </Teleport>
    </div>

    <div class="heatmap__legend" aria-hidden="true">
      <span class="heatmap__legend-label">少</span>
      <span class="heatmap__legend-empty" />
      <span
        v-for="lvl in 4"
        :key="lvl"
        class="heatmap__legend-level"
        :style="{ opacity: 0.25 + lvl * 0.2 }"
      />
      <span class="heatmap__legend-label">多</span>

      <span class="heatmap__legend-sep" />

      <span
        v-for="src in sourceMetas"
        :key="src.id"
        class="heatmap__legend-item"
      >
        <span
          class="heatmap__legend-swatch"
          :style="{ backgroundColor: src.color }"
        />
        {{ src.label }}
      </span>

      <span v-if="sourceMetas.length > 1" class="heatmap__legend-item">
        <span class="heatmap__legend-mixed">
          <span :style="{ backgroundColor: sourceMetas[0]?.color }" />
          <span :style="{ backgroundColor: sourceMetas[1]?.color }" />
        </span>
        混合
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useHeatmapStore } from "@/stores/Heatmap";
import { useThemeStore } from "@/stores/Theme";
import type { HeatmapWeekCell } from "@/types/heatmap";
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
  getCellTotalCount,
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
const sourceMetas = computed(() => heatmap.activeSourceMetas);
const sourceMax = computed(() => heatmap.sourceMax);
const isDark = computed(() => theme.GetThemeColor === "dark");

onMounted(() => {
  void heatmap.load();
});

function showDayLabel(dayIndex: number): boolean {
  return dayIndex === 1 || dayIndex === 3 || dayIndex === 5;
}

function cellStyle(cell: HeatmapWeekCell) {
  if (!cell.inRange) {
    return { backgroundColor: "transparent", visibility: "hidden" as const };
  }
  const bg = getCellBackground(
    cell.counts,
    sourceMetas.value,
    sourceMax.value,
  );
  if (bg.startsWith("linear-gradient")) {
    return { background: bg, backgroundColor: "var(--heatmap-empty)" };
  }
  return { backgroundColor: bg };
}

function tooltipDetails(cell: HeatmapWeekCell) {
  return getCellSourceDetails(cell.counts, sourceMetas.value);
}

function tooltipTotal(cell: HeatmapWeekCell): number {
  return getCellTotalCount(cell.counts);
}

function cellAria(cell: HeatmapWeekCell): string | undefined {
  if (!cell.inRange) return undefined;
  const details = tooltipDetails(cell);
  if (details.length === 0) return `${formatHeatmapDate(cell.date)}，无活动`;
  const parts = details.map(
    (d) => `${d.label} ${d.count} ${getHeatmapSourceUnit()}`,
  );
  if (details.length > 1) {
    parts.push(`共 ${tooltipTotal(cell)} 次提交`);
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
  --heatmap-gap: 2px;
  --heatmap-axis-width: 1.25rem;
  --heatmap-months-height: 1.125rem;
  width: 100%;
}

.heatmap--dark {
  --heatmap-empty: #161b22;
  --heatmap-tooltip-bg: #21262d;
  --heatmap-tooltip-border: rgba(255, 255, 255, 0.12);
  --heatmap-tooltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.heatmap--light {
  --heatmap-tooltip-bg: #fff;
  --heatmap-tooltip-border: rgba(0, 0, 0, 0.1);
  --heatmap-tooltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.heatmap__chart {
  position: relative;
  width: 100%;
}

.heatmap__inner {
  width: 100%;
}

.heatmap__body {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
}

.heatmap__days-col {
  display: flex;
  flex-direction: column;
  width: var(--heatmap-axis-width);
  flex-shrink: 0;
  margin-right: 0;
}

.heatmap__days-gap {
  height: var(--heatmap-months-height);
  margin-bottom: 4px;
  flex-shrink: 0;
}

.heatmap__days-labels {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: var(--heatmap-gap);
  width: 100%;
  flex: 1;
  min-height: 0;
}

.heatmap__day {
  font-size: 0.6875rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 4px;
  opacity: 0;
  user-select: none;
  box-sizing: border-box;
}

.heatmap__day--show {
  opacity: 0.75;
}

.heatmap__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.heatmap__months {
  position: relative;
  height: var(--heatmap-months-height);
  margin-bottom: 4px;
  width: 100%;
  overflow: visible;
}

.heatmap__month {
  position: absolute;
  top: 0;
  font-size: 0.6875rem;
  line-height: var(--heatmap-months-height);
  opacity: 0.75;
  white-space: nowrap;
  pointer-events: none;
}

.heatmap__grid {
  display: flex;
  flex-direction: row;
  gap: var(--heatmap-gap);
  width: 100%;
}

.heatmap__week {
  display: flex;
  flex-direction: column;
  gap: var(--heatmap-gap);
  flex: 1 1 0;
  min-width: 0;
}

.heatmap__cell {
  width: 100%;
  aspect-ratio: 1;
  height: auto;
  border-radius: 2px;
  border: none;
  padding: 0;
  cursor: default;
  display: block;
}

.heatmap__cell--active {
  cursor: pointer;
}

.heatmap__cell--active:hover,
.heatmap__cell--active:focus-visible {
  outline: 1px solid rgba(128, 128, 128, 0.55);
  outline-offset: 1px;
}

.heatmap__cell--pad {
  pointer-events: none;
}

.heatmap__tooltip {
  position: fixed;
  z-index: 50;
  pointer-events: none;
  padding: 0.5rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  line-height: 1.45;
  white-space: nowrap;
  background: var(--heatmap-tooltip-bg);
  border: 1px solid var(--heatmap-tooltip-border);
  box-shadow: var(--heatmap-tooltip-shadow);
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
  opacity: 0.9;
}

.heatmap__tooltip-count {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.heatmap__tooltip-total {
  margin: 0.35rem 0 0;
  padding-top: 0.35rem;
  border-top: 1px solid var(--heatmap-tooltip-border);
  font-size: 0.6875rem;
  opacity: 0.85;
}

.heatmap__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  opacity: 0.85;
}

.heatmap__legend-label {
  font-size: 0.6875rem;
}

.heatmap__legend-empty,
.heatmap__legend-level {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  display: inline-block;
}

.heatmap__legend-empty {
  background: var(--heatmap-empty);
}

.heatmap__legend-level {
  background: #216e39;
}

.heatmap--dark .heatmap__legend-level {
  background: #39d353;
}

.heatmap__legend-sep {
  width: 1px;
  height: 12px;
  background: currentColor;
  opacity: 0.2;
  margin: 0 0.25rem;
}

.heatmap__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.heatmap__legend-swatch {
  width: 11px;
  height: 11px;
  border-radius: 2px;
}

.heatmap__legend-mixed {
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  width: 11px;
  height: 11px;
  border-radius: 2px;
  overflow: hidden;
}

.heatmap__legend-mixed span {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
