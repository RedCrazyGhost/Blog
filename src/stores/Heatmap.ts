import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { fetchAndMergeHeatmap } from "@/service/heatmap/merge";
import { getHeatmapSourceMetas } from "@/service/heatmap/registry";
import type { HeatmapCell } from "@/types/heatmap";
import { buildWeeks } from "@/utils/heatmap/grid";
import { computeSourceMax } from "@/utils/heatmap/color";
import {
  buildSteamGameColors,
  getActiveSteamAppIds,
} from "@/utils/heatmap/steam";

export const useHeatmapStore = defineStore("Heatmap", () => {
  const cells = ref<HeatmapCell[]>([]);
  const loadedSourceIds = ref<string[]>([]);
  const steamGameNames = ref<Record<string, string>>({});
  const steamGameMax = ref<Record<string, number>>({});
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

  const steamGameColors = computed(() =>
    buildSteamGameColors(Object.keys(steamGameNames.value)),
  );

  const activeSteamGames = computed(() => {
    const totals: Record<string, number> = {};
    for (const cell of cells.value) {
      if (!cell.steamGames) continue;
      for (const [appId, hours] of Object.entries(cell.steamGames)) {
        if (hours > 0) {
          totals[appId] = (totals[appId] ?? 0) + hours;
        }
      }
    }

    return getActiveSteamAppIds(cells.value)
      .map((appId) => ({
        appId,
        name: steamGameNames.value[appId] ?? appId,
        color: steamGameColors.value[appId],
        totalHours: totals[appId] ?? 0,
      }))
      .sort((a, b) => b.totalHours - a.totalHours);
  });

  async function load() {
    if (loading.value) return;
    loading.value = true;
    try {
      const result = await fetchAndMergeHeatmap();
      cells.value = result.cells;
      loadedSourceIds.value = result.loadedSourceIds;
      steamGameNames.value = result.steamGameNames;
      steamGameMax.value = result.steamGameMax;
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
    steamGameNames,
    steamGameMax,
    steamGameColors,
    activeSteamGames,
    loading,
    loaded,
    load,
  };
});
