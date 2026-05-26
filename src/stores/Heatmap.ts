import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { fetchAndMergeHeatmap } from "@/service/heatmap/merge";
import { getHeatmapSourceMetas } from "@/service/heatmap/registry";
import type { HeatmapCell } from "@/types/heatmap";
import { buildWeeks } from "@/utils/heatmap/grid";
import { computeSourceMax } from "@/utils/heatmap/color";

export const useHeatmapStore = defineStore("Heatmap", () => {
  const cells = ref<HeatmapCell[]>([]);
  const loadedSourceIds = ref<string[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  const sourceMetas = computed(() => getHeatmapSourceMetas());

  const activeSourceMetas = computed(() =>
    sourceMetas.value.filter((m) => loadedSourceIds.value.includes(m.id)),
  );

  const weeks = computed(() => buildWeeks(cells.value));

  const sourceMax = computed(() =>
    computeSourceMax(
      cells.value,
      activeSourceMetas.value.map((m) => m.id),
    ),
  );

  async function load() {
    if (loading.value) return;
    loading.value = true;
    try {
      const result = await fetchAndMergeHeatmap();
      cells.value = result.cells;
      loadedSourceIds.value = result.loadedSourceIds;
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  return {
    cells,
    weeks,
    sourceMetas,
    activeSourceMetas,
    sourceMax,
    loading,
    loaded,
    load,
  };
});
