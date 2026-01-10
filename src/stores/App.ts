import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { config } from "@/config";

export const useAppStore = defineStore("App", () => {
  const WebSite = ref({
    ArchivalInformation: config.app.website.archivalInformation,
  });

  const Author = ref({
    name: config.app.author.name,
  });

  const Version = ref(config.app.version);

  const GetVersion = computed(() => {
    return Version.value;
  });

  const GetArchivalInformation = computed(() => {
    return WebSite.value.ArchivalInformation;
  });
  const GetAuthorName = computed(() => {
    return Author.value.name;
  });

  return {
    GetVersion,
    GetArchivalInformation,
    GetAuthorName,
  };
});
