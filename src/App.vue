<template>
  <div :class="'w-full ' + theme.GetThemeStyle" :style="{ fontFamily: font.GetUseFont }">
    <TopNav />

    <RouterView id=" router-view" style="min-height: calc(100vh - 9.75rem);overflow: hidden;" />

    <BottomNav />
  </div>

</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TopNav from "@/components/layout/TopNav.vue";
import BottomNav from '@/components/layout/BottomNav.vue';
import { useFontStore } from "@/stores/Font";
import { useThemeStore } from '@/stores/Theme';

const theme = useThemeStore()
const font = useFontStore()
font.LoadFont()

// 确保主题在组件挂载时正确初始化
onMounted(() => {
  // Theme store 会在初始化时设置 dark class，这里确保同步
  const htmlElement = document.documentElement;
  if (theme.GetThemeColor === 'dark') {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
})

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
  padding: 2rem 1rem 16px 1rem;
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

.text-light {
  color: #f8f9fa !important;
}

.text-dark {
  color: #212529 !important;
}

.thead-light {
  border-bottom: 2px #000 solid;
}

.thead-dark {
  border-bottom: 2px #fff solid;
}


.bd-callout {
  padding: 1.25rem;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  border: 1px solid #e9ecef;
  border-left-width: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  min-height: fit-content;
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

.bd-callout>p {
  margin: 0 !important;
  margin-bottom: 0 !important;
  display: inline;
  line-height: 1.5;
}

.bd-callout>p+p::before {
  content: ' ';
}

a {
  text-decoration: none
}

/* Markdown 基础样式 */
.markdown-content,
div[id^='miniMD-'],
div[id*='miniMD-'] {
  line-height: 1.6;
}

.markdown-content h1,
div[id^='miniMD-'] h1,
div[id*='miniMD-'] h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.25;
}

.markdown-content h2,
div[id^='miniMD-'] h2,
div[id*='miniMD-'] h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.25;
}

.markdown-content h3,
div[id^='miniMD-'] h3,
div[id*='miniMD-'] h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  line-height: 1.25;
}

.markdown-content h4,
div[id^='miniMD-'] h4,
div[id*='miniMD-'] h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.25;
}

.markdown-content h5,
div[id^='miniMD-'] h5,
div[id*='miniMD-'] h5 {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  line-height: 1.25;
}

.markdown-content h6,
div[id^='miniMD-'] h6,
div[id*='miniMD-'] h6 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  line-height: 1.25;
}

.markdown-content p,
div[id^='miniMD-'] p,
div[id*='miniMD-'] p {
  margin-top: 0;
  margin-bottom: 1rem;
}

.markdown-content ul,
.markdown-content ol,
div[id^='miniMD-'] ul,
div[id^='miniMD-'] ol,
div[id*='miniMD-'] ul,
div[id*='miniMD-'] ol {
  margin-top: 0;
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.markdown-content li,
div[id^='miniMD-'] li,
div[id*='miniMD-'] li {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.markdown-content blockquote,
div[id^='miniMD-'] blockquote,
div[id*='miniMD-'] blockquote {
  margin-top: 0;
  margin-bottom: 1rem;
}

.markdown-content code,
div[id^='miniMD-'] code,
div[id*='miniMD-'] code {
  font-size: 0.875em;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.markdown-content pre,
div[id^='miniMD-'] pre,
div[id*='miniMD-'] pre {
  margin-top: 0;
  margin-bottom: 1rem;
  overflow-x: auto;
}

/* 消除代码块内 p 标签的下边距 */
pre[class*='language-'] p,
pre p,
.markdown-content pre p,
div[id^='miniMD-'] pre p,
div[id*='miniMD-'] pre p {
  margin-bottom: 0;
}

.markdown-content img,
div[id^='miniMD-'] img,
div[id*='miniMD-'] img {
  max-width: 100%;
  height: auto;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.markdown-content hr,
div[id^='miniMD-'] hr,
div[id*='miniMD-'] hr {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border: 0;
  border-top: 1px solid;
}

/* Markdown 解析后的链接样式 - 显示正常的链接颜色 */
div[id^='miniMD-'] a:not(.removeA),
div[id*='miniMD-'] a:not(.removeA),
.markdown-content a,
.markdown-content h1 a,
.markdown-content h2 a,
.markdown-content h3 a,
.markdown-content h4 a,
.markdown-content h5 a,
.markdown-content h6 a,
div[id^='miniMD-'] h1 a:not(.removeA),
div[id^='miniMD-'] h2 a:not(.removeA),
div[id^='miniMD-'] h3 a:not(.removeA),
div[id^='miniMD-'] h4 a:not(.removeA),
div[id^='miniMD-'] h5 a:not(.removeA),
div[id^='miniMD-'] h6 a:not(.removeA) {
  color: #0d6efd !important;
  text-decoration: none;
}

.bg-dark div[id^='miniMD-'] a:not(.removeA),
.bg-dark div[id*='miniMD-'] a:not(.removeA),
.bg-dark .markdown-content a,
.bg-dark .markdown-content h1 a,
.bg-dark .markdown-content h2 a,
.bg-dark .markdown-content h3 a,
.bg-dark .markdown-content h4 a,
.bg-dark .markdown-content h5 a,
.bg-dark .markdown-content h6 a,
.bg-dark div[id^='miniMD-'] h1 a:not(.removeA),
.bg-dark div[id^='miniMD-'] h2 a:not(.removeA),
.bg-dark div[id^='miniMD-'] h3 a:not(.removeA),
.bg-dark div[id^='miniMD-'] h4 a:not(.removeA),
.bg-dark div[id^='miniMD-'] h5 a:not(.removeA),
.bg-dark div[id^='miniMD-'] h6 a:not(.removeA) {
  color: #5d9eff !important;
}

div[id^='miniMD-'] a:not(.removeA):hover,
div[id*='miniMD-'] a:not(.removeA):hover,
.markdown-content a:hover,
.markdown-content h1 a:hover,
.markdown-content h2 a:hover,
.markdown-content h3 a:hover,
.markdown-content h4 a:hover,
.markdown-content h5 a:hover,
.markdown-content h6 a:hover,
div[id^='miniMD-'] h1 a:not(.removeA):hover,
div[id^='miniMD-'] h2 a:not(.removeA):hover,
div[id^='miniMD-'] h3 a:not(.removeA):hover,
div[id^='miniMD-'] h4 a:not(.removeA):hover,
div[id^='miniMD-'] h5 a:not(.removeA):hover,
div[id^='miniMD-'] h6 a:not(.removeA):hover {
  opacity: 0.8;
}

/* Markdown 暗色主题样式 */
.bg-dark .markdown-content,
.bg-dark div[id^='miniMD-'],
.bg-dark div[id*='miniMD-'] {
  color: #f8f9fa;
}

.bg-dark .markdown-content h1,
.bg-dark .markdown-content h2,
.bg-dark .markdown-content h3,
.bg-dark .markdown-content h4,
.bg-dark .markdown-content h5,
.bg-dark .markdown-content h6,
.bg-dark div[id^='miniMD-'] h1,
.bg-dark div[id^='miniMD-'] h2,
.bg-dark div[id^='miniMD-'] h3,
.bg-dark div[id^='miniMD-'] h4,
.bg-dark div[id^='miniMD-'] h5,
.bg-dark div[id^='miniMD-'] h6,
.bg-dark div[id*='miniMD-'] h1,
.bg-dark div[id*='miniMD-'] h2,
.bg-dark div[id*='miniMD-'] h3,
.bg-dark div[id*='miniMD-'] h4,
.bg-dark div[id*='miniMD-'] h5,
.bg-dark div[id*='miniMD-'] h6 {
  color: #f8f9fa;
}

.bg-dark .markdown-content code,
.bg-dark div[id^='miniMD-'] code,
.bg-dark div[id*='miniMD-'] code {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
}

.bg-dark .markdown-content hr,
.bg-dark div[id^='miniMD-'] hr,
.bg-dark div[id*='miniMD-'] hr {
  border-top-color: rgba(255, 255, 255, 0.2);
}
</style>