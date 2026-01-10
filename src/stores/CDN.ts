import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCDNStore = defineStore("CDN", () => {
  const CDN = ref({
    url: "https://cdn.jsdelivr.net/gh//RedCrazyGhost/CDN",
  });

  function getURL(SourcePath: string) {
    return CDN.value.url + SourcePath;
  }

  return {
    getURL,
  };
});
