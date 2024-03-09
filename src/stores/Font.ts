import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFontStore = defineStore('Font', () => {
    const Font = ref({
        isFontLoaded: false,
        fontFamilyName: "HYCuYuanJ",
        loadUrls: [
            "/fonts/HYCuYuanJ.ttf",
            "https://cdn.jsdelivr.net/gh//RedCrazyGhost/CDN/TTF/HYCuYuanJ-Blog-RedCrazyGhost.ttf",
            "https://cdn.jsdelivr.net/gh//RedCrazyGhost/CDN/TTF/HYCuYuanJ.ttf",
        ],
        useFont: "system-ui"
    })

    function getUrl():string{
        return "url("+Font.value.loadUrls.join("),url(")+"),"
    }


    function LoadFont(){
        const font = new FontFace(Font.value.fontFamilyName, getUrl());
        document.fonts.add(font)

        font.load().then(() => {
            Font.value.useFont = Font.value.fontFamilyName
        }).finally(() => {
            Font.value.isFontLoaded = true
        })

    }
    
    const GetUseFont = computed(() => {
        return Font.value.useFont
    })

    const GetIsFontLoaded = computed(() => {
        return Font.value.isFontLoaded
      })

      return {
        GetIsFontLoaded,GetUseFont,
        LoadFont
      }
})