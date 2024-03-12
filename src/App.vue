<template>
  <div :class="'container-fluid '+theme.GetThemeStyle" :style={fontFamily:font.GetUseFont}>
    <TopNav />   

    <RouterView v-if="font.GetIsFontLoaded" id="router-view" style="min-height: calc(100vh - 9.75rem)"/>
    <LoadingViewVue v-else style="min-height: calc(100vh - 9.75rem)"/>

    <BottomNav />
  </div>

</template> 
<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNav from "./components/TopNav.vue";
import BottomNav from './components/BottomNav.vue';
import LoadingViewVue from './views/LoadingView.vue';
import { useFontStore } from "@/stores/Font";
import { useThemeStore } from '@/stores/Theme';

const theme= useThemeStore()
const  font  = useFontStore()
font.LoadFont()

</script>
<style>
pre[class*='language-']::before {
    content: '';
    position: absolute;
    top: 9px;
    left: 15px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fc625d;
    box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
    z-index: 1;
}

pre[class*='language-'] {
  position: relative;
  padding: 2rem 1rem 0.5rem;
  border-radius: 0.25rem;
}

.pre-light {
    background-color: #f6f8fa;
}
.pre-dark {
    background-color: #2d333b;
}

.bg-light {
  background-color: #fff !important;
}

.bg-dark {
  background-color: #212529 !important;
}

.thead-light {
  border-bottom: 2px #000 solid;
}
.thead-dark{
  border-bottom: 2px #fff solid;
}


.bd-callout {
    padding: 1.25rem;
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    border: 1px solid #e9ecef;
    border-left-width: 0.25rem;
    border-radius: 0.25rem;
}

.bd-callout-light {
  border-left-color: #5bc0de;
}

.bd-callout-dark {
  border-left-color: #f0ad4e;
}

.bd-callout+.bd-callout {
    margin-top: -0.25rem;
}

.bd-callout > p {
  margin-bottom: 0px;
}

.bd-callout > p + p {
  margin-top: 1rem;
}

a{text-decoration:none}
</style>