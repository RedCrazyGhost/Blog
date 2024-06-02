<template>
<div>
    <div  class="offset-1 col-10">
        <MiniMarkdown v-for="item in m.GetMarkdowns" :key="item.title" :Markdown="item"/>
    </div>
    <LogosWall />

    <Loading v-if="m.GetMarkdowns.length == 0"/>

</div>
</template>

<script setup lang="ts">
import LogosWall from '@/components/LogosWall.vue'
import MiniMarkdown from '@/components/MiniMarkdown.vue';
import { useGithubStore } from '@/stores/Github'
import mermaid from 'mermaid';
import { useMarkdownStore } from '@/stores/Markdown'
import { onMounted, onUpdated } from 'vue';
import Loading from '@/components/Loading.vue';

const m = useMarkdownStore()
const github = useGithubStore()

onMounted(()=>{
    mermaid.run();

    var scrollTimeout: number | null
    window.addEventListener('scroll',()=>{
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        if(window.scrollY + window.innerHeight >= scrollHeight - 500){
            
            if (!scrollTimeout){
                scrollTimeout = setTimeout(()=>{
                    scrollTimeout = null
                    github.GetIssues();
                },10000)
            }
        }

    },true)
})

onUpdated(() => {
    mermaid.run();
})

github.GetIssues()
</script>