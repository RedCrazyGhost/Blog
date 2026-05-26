<template>
  <div ref="contentRef" class="markdown-content" v-html="m.parseCurrentMarkdownHTML"></div>
</template>
<script setup lang="ts">
import { useMarkdownStore } from "@/stores/Markdown";
import { bindCodeBlockCopy } from "@/utils/markdown/codeBlockCopy";
import mermaid from "mermaid";
import { watch, nextTick, onUnmounted, ref } from "vue";

const m = useMarkdownStore();
const contentRef = ref<HTMLElement | null>(null);
let renderTimer: number | null = null;
let isRendering = ref(false);
let unbindCopy: (() => void) | null = null;

function setupCodeCopy() {
  if (unbindCopy) {
    unbindCopy();
    unbindCopy = null;
  }
  if (contentRef.value) {
    unbindCopy = bindCodeBlockCopy(contentRef.value);
  }
}

async function renderMermaid() {
  if (isRendering.value) {
    return;
  }

  isRendering.value = true;
  await nextTick();
  setupCodeCopy();

  if (renderTimer !== null) {
    clearTimeout(renderTimer);
  }

  renderTimer = window.setTimeout(() => {
    mermaid.run();
    isRendering.value = false;
    renderTimer = null;
  }, 0);
}

onUnmounted(() => {
  if (renderTimer !== null) {
    clearTimeout(renderTimer);
    renderTimer = null;
  }
  if (unbindCopy) {
    unbindCopy();
    unbindCopy = null;
  }
  isRendering.value = false;
});

watch(
  () => m.parseCurrentMarkdownHTML,
  () => {
    renderMermaid();
  },
  { immediate: true },
);
</script>
