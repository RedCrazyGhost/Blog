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

onMounted(()=>{
    mermaid.run();
})

onUpdated(() => {
    mermaid.run();
})


const m = useMarkdownStore()
const github = useGithubStore()

github.GetIssues()


</script>