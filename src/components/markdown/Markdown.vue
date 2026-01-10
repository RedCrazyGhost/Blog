<template>
    <div class="markdown-content" v-html="m.parseCurrentMarkdownHTML"></div>
</template>
<script setup lang="ts">
import { useMarkdownStore } from "@/stores/Markdown";
import mermaid from "mermaid";
import { watch, nextTick, onUnmounted, ref } from "vue";

const m = useMarkdownStore()
let renderTimer: number | null = null;
let isRendering = ref(false);

async function renderMermaid() {
    // 防止重复渲染
    if (isRendering.value) {
        return;
    }
    
    isRendering.value = true;
    await nextTick();
    
    // 清除之前的定时器
    if (renderTimer !== null) {
        clearTimeout(renderTimer);
    }
    
    // 使用 setTimeout 确保 DOM 完全渲染
    renderTimer = window.setTimeout(() => {
    mermaid.run();
        isRendering.value = false;
        renderTimer = null;
    }, 0);
}

// 组件卸载时清理定时器
onUnmounted(() => {
    if (renderTimer !== null) {
        clearTimeout(renderTimer);
        renderTimer = null;
    }
    isRendering.value = false;
});

// 只使用 watch 监听 HTML 内容变化，避免 onUpdated 重复触发
watch(() => m.parseCurrentMarkdownHTML, () => {
    renderMermaid();
}, { immediate: true });

</script>