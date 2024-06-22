<template>
        <div v-html="m.parseCurrentMarkdownHTML">
        </div>
</template>
<script setup lang="ts">
import { useMarkdownStore } from "@/stores/Markdown";
import mermaid from "mermaid";
import { onUpdated } from "vue";


const m = useMarkdownStore()

onUpdated(() => {
    mermaid.run()    
})


</script>