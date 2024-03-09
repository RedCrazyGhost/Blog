import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('App', () => {
    const WebSite = ref({
      ArchivalInformation:"鄂ICP备19031343号-1"
    })
  
    const Author = ref(
      {
        name:"RedCrazyGhost"
    })

    const Version = ref("v1.0.4")





    const GetVersion = computed(() => {
      return Version.value
    })

    const GetArchivalInformation = computed(() => {
      return WebSite.value.ArchivalInformation
    })
    const GetAuthorName = computed(() => {
      return Author.value.name
    })
   


    return { 
      GetVersion,GetArchivalInformation,GetAuthorName,
    }
  })
  