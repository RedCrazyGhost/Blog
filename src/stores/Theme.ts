import { ref, computed } from "vue";
import { defineStore } from "pinia";

export interface ThemeColor {
  FontColor: string;
  BackgroundColor: string;
}

export const useThemeStore = defineStore("Theme", () => {
  const Theme = ref<ThemeColor>({
    FontColor: "dark",
    BackgroundColor: "light",
  });

  function SetThemeLight() {
    Theme.value.FontColor = "dark";
    Theme.value.BackgroundColor = "light";
  }

  function SetThemeDark() {
    Theme.value.FontColor = "light";
    Theme.value.BackgroundColor = "dark";
  }

  const GetThemeStyle = computed(
    () => `bg-${Theme.value.BackgroundColor} text-${Theme.value.FontColor}`
  );

  const GetThemeColor = computed(() => Theme.value.BackgroundColor);

  const GetBackgroundColorStyle = computed(
    () => `bg-${Theme.value.BackgroundColor}`
  );

  const GetFontColorStyle = computed(() => `text-${Theme.value.FontColor}`);

  const GetNavbarStyle = computed(
    () => `navbar-${Theme.value.BackgroundColor}`
  );

  const GetTableColor = computed(() =>
    Theme.value.BackgroundColor === "light" ? "" : "table-dark"
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
