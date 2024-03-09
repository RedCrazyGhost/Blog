<template>
    <div class="container d-flex align-items-center justify-content-center" >
        <!-- :style="{height: s.GetHStyle,width: s.GetWStyle}" -->
        <Loading/>
   </div>
</template>
<script setup lang="ts">
import Loading from '@/components/Loading.vue'
import { useScreenStore } from '@/stores/Screen'

const s = useScreenStore()

s.SetH(screen.height)
s.SetW(screen.width)

window.onresize = () => {
    s.SetH(screen.height)
    s.SetW(screen.width)
};
</script>