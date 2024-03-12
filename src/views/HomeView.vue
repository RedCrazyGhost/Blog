<template>
<div>
    <div>
        <MiniMarkdown v-for="item in m.GetMarkdowns" :key="item.title" :Markdown="item"/>
    </div>
</div>
</template>

<script setup lang="ts">
import MiniMarkdown from '@/components/MiniMarkdown.vue';
import { useGithubStore } from '@/stores/Github'
import mermaid from 'mermaid';
import { useMarkdownStore } from '@/stores/Markdown'
import { onMounted, onUpdated } from 'vue';


var page = 1;

onMounted(()=>{
    mermaid.run();

    window.addEventListener('scroll',()=>{
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        if(page < 3 && window.scrollY + window.innerHeight >= scrollHeight - 500){
            github.GetIssues(page++);
        }

    },true)
})

        

onUpdated(() => {
    mermaid.run();
})


const m = useMarkdownStore()
const github = useGithubStore()

github.GetIssues(page++)


</script>