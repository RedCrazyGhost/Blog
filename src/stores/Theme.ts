import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";

export interface ThemeColor {
  FontColor: string;
  BackgroundColor: string;
}

// 更新 HTML 根元素的 dark class
function updateHtmlDarkClass(isDark: boolean) {
  const htmlElement = document.documentElement;
  if (isDark) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
}

export const useThemeStore = defineStore("Theme", () => {
  const Theme = ref<ThemeColor>({
    FontColor: "dark",
    BackgroundColor: "light",
  });

  // 初始化时设置 dark class
  if (typeof document !== 'undefined') {
    updateHtmlDarkClass(Theme.value.BackgroundColor === 'dark');
  }

  function SetThemeLight() {
    Theme.value.FontColor = "dark";
    Theme.value.BackgroundColor = "light";
    updateHtmlDarkClass(false);
  }

  function SetThemeDark() {
    Theme.value.FontColor = "light";
    Theme.value.BackgroundColor = "dark";
    updateHtmlDarkClass(true);
  }

  // 监听主题变化，同步更新 HTML dark class
  watch(
    () => Theme.value.BackgroundColor,
    (newColor) => {
      updateHtmlDarkClass(newColor === 'dark');
    }
  );

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
