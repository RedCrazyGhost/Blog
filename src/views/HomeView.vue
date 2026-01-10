<template>
    <div>
        <div class="max-w-5xl mx-auto px-4">
            <MiniMarkdown v-for="item in m.GetMarkdowns" :key="item.title" :Markdown="item" />
        </div>
        <LoadingView v-if="m.GetMarkdowns.length == 0" />
    </div>
</template>

<script setup lang="ts">
import MiniMarkdown from '@/components/markdown/MiniMarkdown.vue';
import { useGithubStore } from '@/stores/Github'
import mermaid from 'mermaid';
import { useMarkdownStore } from '@/stores/Markdown'
import { onMounted, onUpdated, onUnmounted, ref } from 'vue';
import LoadingView from '@/views/LoadingView.vue';

const m = useMarkdownStore()
const github = useGithubStore()

// 滚动相关状态
const scrollTimeout = ref<number | null>(null);

// 滚动处理函数
function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (window.scrollY + window.innerHeight >= scrollHeight - 500) {
        if (!scrollTimeout.value) {
            scrollTimeout.value = window.setTimeout(() => {
                scrollTimeout.value = null;
                // 加载下一页
                github.GetIssues(github.currentPage + 1);
            }, 1000);
        }
    }
}

onMounted(async () => {
    mermaid.run();

    // 初始加载第一页数据
    if (m.GetMarkdowns.length === 0) {
        await github.GetIssues(1);
    }

    // 滚动加载更多 - 添加事件监听器
    window.addEventListener('scroll', handleScroll, { passive: true });
})

// 组件卸载时清理事件监听器和定时器
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value);
        scrollTimeout.value = null;
    }
})

onUpdated(() => {
    mermaid.run();
})
</script>
