<template>
  <div class="tl" :class="themeClass" :style="cssVars">
    <div v-for="(item, i) in sortedItems" :key="i" class="tl__item">
      <div class="tl__track">
        <div
          v-if="item.startDate || item.endDate || item.date"
          class="tl__axis-range"
        >
          <template v-if="item.startDate">
            <span class="tl__axis-date">
              {{ item.endDate ?? item.date ?? "" }}
            </span>
            <div
              v-if="item.startDate"
              class="tl__range-line"
              aria-hidden="true"
            >
              <span v-for="n in 5" :key="n" class="tl__range-seg" />
            </div>
            <span class="tl__axis-date">
              {{ item.startDate ?? "" }}
            </span>
          </template>
          <template v-else>
            <span class="tl__axis-date">
              {{ item.endDate ?? item.date ?? "" }}
            </span>
          </template>
        </div>
      </div>
      <div class="tl__body">
        <div class="tl__card">
          <span class="tl__title">{{ item.title }}</span>
          <p v-if="item.description" class="tl__desc">{{ item.description }}</p>
          <template v-if="item.responsibilities?.length">
            <span class="tl__label">工作职责</span>
            <ul class="tl__list">
              <li v-for="(r, ri) in item.responsibilities" :key="ri">
                {{ r }}
              </li>
            </ul>
          </template>
          <template v-if="item.deliverables?.length">
            <span class="tl__label">工作产出</span>
            <ul class="tl__list">
              <li v-for="(d, di) in item.deliverables" :key="di">{{ d }}</li>
            </ul>
          </template>
          <slot v-if="$slots.item" name="item" :item="item" :index="i" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/stores/Theme";
import type { TimelineItem } from "@/types/timeline";

const props = withDefaults(
  defineProps<{
    items: TimelineItem[];
    accentColor?: string;
  }>(),
  { accentColor: "" },
);

const theme = useThemeStore();
const isDark = computed(() => theme.GetThemeColor === "dark");

const accent = computed(() => {
  if (props.accentColor) return props.accentColor;
  return isDark.value ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)";
});

const line = computed(() => {
  if (props.accentColor) return props.accentColor;
  return isDark.value ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.2)";
});

const cssVars = computed(() => ({
  "--tl-line": line.value,
  "--tl-accent": accent.value,
}));

const themeClass = computed(() => (isDark.value ? "tl--dark" : "tl--light"));

/** 按 date 降序排序，时间越大的越上面，无 date 的项排在末尾 */
const sortedItems = computed(() => {
  const list = [...props.items];
  return list.sort((a, b) => {
    const endA = a.endDate ?? a.date ?? "";
    const endB = b.endDate ?? b.date ?? "";
    if (!endA) return 1;
    if (!endB) return -1;
    return endB.localeCompare(endA);
  });
});
</script>

<style scoped>
.tl {
  --tl-line: rgba(0, 0, 0, 0.2);
  --tl-accent: rgba(0, 0, 0, 0.2);
}

.tl__item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding-bottom: 2.5rem;
}

.tl__item:last-child {
  padding-bottom: 0;
}

.tl__track {
  flex-shrink: 0;
  width: 5.5rem;
  display: flex;
  justify-content: flex-end;
  padding-top: 0.2rem;
  align-self: stretch;
}

.tl__axis-date {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.tl__axis-range {
  display: flex;
  flex-direction: column;
  align-items: anchor-center;
  justify-content: space-between;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  gap: 0;
}

.tl__axis-range .tl__axis-date {
  font-size: 1rem;
}

.tl__axis-ticks {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  flex: 1;
}

.tl__tick {
  width: 2px;
  border-radius: 2px;
  background: var(--tl-accent);
  opacity: 0.95;
}

.tl__tick:nth-child(1) {
  height: 5px;
}

.tl__tick:nth-child(2) {
  height: 8px;
}

.tl__tick:nth-child(3) {
  height: 6px;
}

.tl__tick:nth-child(4) {
  height: 9px;
}

.tl__tick:nth-child(5) {
  height: 7px;
}

.tl--light .tl__axis-date {
  color: #475569;
}

.tl--dark .tl__axis-date {
  color: #94a3b8;
}

.tl__body {
  flex: 1;
  min-width: 0;
  padding-top: 0.15rem;
}

.tl__card {
  border-radius: 0.75rem;
  padding: 1.5rem 1.75rem;
  border: 2px solid;
  transition: box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}

.tl__card > :not(.tl__range-line) {
  position: relative;
  z-index: 1;
}

.tl__range-line {
  height: 100%;
  width: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
  pointer-events: none;
  opacity: 0.95;
  z-index: 0;
}

.tl__range-seg {
  flex: 1;
  width: 2px;
  border-radius: 2px;
  background: var(--tl-accent);
}

.tl--light .tl__card {
  background: #fff;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tl--light .tl__card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.tl--dark .tl__card {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.tl--dark .tl__card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
}

.tl__title {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  display: block;
  line-height: 1.35;
}

.tl__desc {
  margin-top: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  opacity: 0.88;
}

.tl--light .tl__desc {
  color: #475569;
}

.tl--dark .tl__desc {
  color: #cbd5e1;
}

.tl__label {
  display: block;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.tl--light .tl__label {
  color: #475569;
}

.tl--dark .tl__label {
  color: #94a3b8;
}

.tl__list {
  margin-top: 0.35rem;
  padding-left: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  opacity: 0.88;
}

.tl__list li {
  margin-top: 0.25rem;
}

.tl--light .tl__list {
  color: #475569;
}

.tl--dark .tl__list {
  color: #cbd5e1;
}
</style>
