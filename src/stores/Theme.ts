import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useThemeStore = defineStore('Theme', () => {
    const Theme = ref({
        FontColor: "dark",
        BackgroundColor: "light"
      })

      function SetThemeLight() {
        Theme.value.FontColor = "dark"
        Theme.value.BackgroundColor = "light"
      }
      function SetThemeDark() {
        Theme.value.FontColor = "light"
        Theme.value.BackgroundColor = "dark"
      }

      const GetThemeStyle = computed(() => {
        return "bg-"+Theme.value.BackgroundColor+" text-"+Theme.value.FontColor
      })
      const GetThemeColor = computed(() => {
        return Theme.value.BackgroundColor
      })

      const GetBackgroundColorStyle = computed(() => {
        return "bg-"+Theme.value.BackgroundColor
      })
      const GetFontColorStyle = computed(() => {
        return "text-"+Theme.value.FontColor
      })
      const GetNavbarStyle = computed(() => {
        return "navbar-"+Theme.value.BackgroundColor
      })

      const GetTableColor = computed(() => {
        return  Theme.value.BackgroundColor === "light" ? "" : "table-dark"
      })

      function SwitchTheme() {
        if (Theme.value.BackgroundColor == "light") {
          SetThemeDark()
        } else {
          SetThemeLight()
        }
      }
    return {
      GetThemeColor,GetBackgroundColorStyle,GetFontColorStyle,GetNavbarStyle,
      GetThemeStyle,GetTableColor,
        SetThemeLight,SetThemeDark,SwitchTheme
    }
})