<template>
    <div>
        <div class="max-w-5xl mx-auto px-4">
            <Markdown :id="r.params.id" />
        </div>
    </div>
</template>
<script setup lang="ts">
import Markdown from '@/components/markdown/Markdown.vue';
import { useRoute } from 'vue-router';
import { useGithubStore } from '@/stores/Github';
import { onMounted, onUpdated, nextTick } from 'vue';
import mermaid from 'mermaid';

async function renderMermaid() {
    await nextTick();
    mermaid.run();
}

onMounted(() => {
    renderMermaid();
})

onUpdated(() => {
    renderMermaid();
})

const github = useGithubStore()
const r = useRoute()

github.GetIssue(Number(r.params.id))

</script>