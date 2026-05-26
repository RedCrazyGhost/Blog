import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";

export const THEME_STORAGE_KEY = "blog-theme";
export type ThemeMode = "light" | "dark";

export interface ThemeColor {
  FontColor: string;
  BackgroundColor: string;
}

function updateHtmlDarkClass(isDark: boolean) {
  const htmlElement = document.documentElement;
  if (isDark) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
}

function readStoredTheme(): ThemeMode {
  if (typeof localStorage === "undefined") return "light";
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function persistTheme(mode: ThemeMode) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // 隐私模式或配额满时忽略
  }
}

export const useThemeStore = defineStore("Theme", () => {
  const Theme = ref<ThemeColor>({
    FontColor: "dark",
    BackgroundColor: "light",
  });

  function SetThemeLight() {
    Theme.value.FontColor = "dark";
    Theme.value.BackgroundColor = "light";
    updateHtmlDarkClass(false);
    persistTheme("light");
  }

  function SetThemeDark() {
    Theme.value.FontColor = "light";
    Theme.value.BackgroundColor = "dark";
    updateHtmlDarkClass(true);
    persistTheme("dark");
  }

  const stored = readStoredTheme();
  if (stored === "dark") {
    SetThemeDark();
  } else {
    SetThemeLight();
  }

  watch(
    () => Theme.value.BackgroundColor,
    (newColor) => {
      updateHtmlDarkClass(newColor === "dark");
    },
  );

  const GetThemeStyle = computed(
    () => `bg-${Theme.value.BackgroundColor} text-${Theme.value.FontColor}`,
  );

  const GetThemeColor = computed(() => Theme.value.BackgroundColor);

  const GetBackgroundColorStyle = computed(
    () => `bg-${Theme.value.BackgroundColor}`,
  );

  const GetFontColorStyle = computed(() => `text-${Theme.value.FontColor}`);

  const GetNavbarStyle = computed(
    () => `navbar-${Theme.value.BackgroundColor}`,
  );

  const GetTableColor = computed(() =>
    Theme.value.BackgroundColor === "light" ? "" : "table-dark",
  );

  function SwitchTheme() {
    Theme.value.BackgroundColor === "light" ? SetThemeDark() : SetThemeLight();
  }

  return {
    GetThemeColor,
    GetBackgroundColorStyle,
    GetFontColorStyle,
    GetNavbarStyle,
    GetThemeStyle,
    GetTableColor,
    SetThemeLight,
    SetThemeDark,
    SwitchTheme,
  };
});
