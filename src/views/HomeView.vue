<template>
  <div>
    <LoadingView
      v-if="m.GetMarkdowns.length === 0 && github.loading"
    />
    <div
      v-else-if="m.GetMarkdowns.length === 0 && github.error"
      class="max-w-5xl mx-auto px-4 py-16 text-center"
    >
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ github.error }}</p>
      <button
        type="button"
        class="px-4 py-2 rounded-md bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 hover:opacity-90 transition-opacity"
        @click="handleRetry"
      >
        重试
      </button>
    </div>
    <div
      v-else-if="m.GetMarkdowns.length === 0"
      class="max-w-5xl mx-auto px-4 py-16 text-center text-gray-600 dark:text-gray-400"
    >
      暂无文章
    </div>
    <template v-else>
      <div class="max-w-5xl mx-auto px-4">
        <MiniMarkdown
          v-for="item in m.GetMarkdowns"
          :key="item.title"
          :markdown="item"
        />
      </div>
      <div
        v-if="github.loading"
        class="max-w-5xl mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        加载中…
      </div>
      <div
        v-else-if="!github.hasMore"
        class="max-w-5xl mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        没有更多了
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import MiniMarkdown from "@/components/markdown/MiniMarkdown.vue";
import { useGithubStore } from "@/stores/Github";
import mermaid from "mermaid";
import { useMarkdownStore } from "@/stores/Markdown";
import { onMounted, onUpdated, onUnmounted, ref } from "vue";
import LoadingView from "@/views/LoadingView.vue";

const m = useMarkdownStore();
const github = useGithubStore();

const scrollTimeout = ref<number | null>(null);

function handleScroll() {
  if (github.loading || !github.hasMore) return;

  const scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;
  if (window.scrollY + window.innerHeight >= scrollHeight - 500) {
    if (!scrollTimeout.value) {
      scrollTimeout.value = window.setTimeout(() => {
        scrollTimeout.value = null;
        github.GetIssues(github.currentPage + 1);
      }, 1000);
    }
  }
}

function handleRetry() {
  github.clearError();
  github.GetIssues(1, 10, true);
}

onMounted(async () => {
  mermaid.run();

  if (m.GetMarkdowns.length === 0) {
    await github.GetIssues(1);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
    scrollTimeout.value = null;
  }
});

onUpdated(() => {
  mermaid.run();
});
</script>
