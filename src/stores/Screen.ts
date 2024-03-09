import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useScreenStore = defineStore('Screen', () => {
    const H = ref(0)
    const W = ref(0)

    function SetH(height:number){
        H.value = height
    }
    function SetW(width:number){
        W.value = width
    }



    const GetH = computed(() => {
        return H.value
      })
    const GetW = computed(() => {
        return W.value
    })
    const GetHStyle = computed(() => {
        return H.value+'px'
    })
    const GetWStyle = computed(() => {
        return W.value+'px'
    })

    return {
        GetH,GetW,GetHStyle,GetWStyle,
        SetH,SetW
    }
})