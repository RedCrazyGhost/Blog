<template>
  <div :class="'shadow card card-' + theme.GetThemeColor + ' ' + theme.GetThemeStyle
    " style="margin-top: 1.5rem">
    <div :class="'p-3 card-header header-' + theme.GetThemeColor">
      <router-link @click="scrollToTop" :class="'removeA ' + theme.GetThemeStyle"
        :to="{ path: 'markdown/' + props.Markdown.number }">
        <h5 class="removeMarginBottom">{{ props.Markdown.title }}</h5>
      </router-link>
    </div>

    <div class="card-body">
      <router-link @click="scrollToTop" :class="'removeA ' + theme.GetThemeStyle"
        :to="{ path: 'markdown/' + props.Markdown.number }">
        <div :id="'miniMD-' + props.Markdown.number" v-html="miniMarkdownHTML"></div>

        <p class="card-text">
          <small class="text-muted">更多详细内容请单击查看！</small>
        </p>
        <p class="card-text">
          <small class="text-muted"><font-awesome-icon class="iconTheme" icon="fa-regular fa-calendar-plus" />
            {{ formatDate(props.Markdown.created_at) }}</small>
          <small class="text-muted"><font-awesome-icon class="iconTheme" icon="fa-solid fa-hourglass-half" />
            {{ formatDate(props.Markdown.updated_at) }}</small>
        </p>
      </router-link>
    </div>

    <div :class="'card-footer footer-' + theme.GetThemeColor" v-if="props.Markdown.labels.length !== 0">
      <Tag v-for="tag in Markdown.labels" :key="tag.id" :Tag="tag" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/date";
import { useThemeStore } from "@/stores/Theme";
import { useMarkdownStore } from "@/stores/Markdown";
import Tag from "@/components/common/Tag.vue";
import { ref, onMounted, watch, nextTick, onUpdated, onUnmounted } from "vue";
import mermaid from "mermaid";
import { marked } from "marked";
import type { Tokens } from "marked";

const theme = useThemeStore();
const m = useMarkdownStore();
const props = defineProps(["Markdown"]);
const miniMarkdownHTML = ref<string>("");
const isParsing = ref(false);
const lastParsedBody = ref<string>("");
let renderTimer: number | null = null;
let isRendering = ref(false);


/**
 * 智能截取 markdown 内容，使用 AST 解析法确保准确性
 * @param str markdown 文本
 * @param maxLength 最大长度（字符数，默认 50）
 * @returns 截取后的 markdown 文本
 */
function MiniBody(str: string, maxLength: number = 50): string {
  if (!str) return "";
  
  // 如果内容长度小于限制，直接返回
  if (str.length <= maxLength) {
    return str;
  }

  // 从 maxLength 开始向后查找结束位置
  // 结束的位置：结束的标点符号、markdown 的代码块、段落 \n
  
  // 检查是否在代码块内（查找 ``` 或 ```）
  const codeBlockStart = /```[\s\S]*?```/g;
  let lastCodeBlockEnd = -1;
  let match: RegExpExecArray | null;
  
  // 找到所有代码块，检查 maxLength 是否在某个代码块内
  while ((match = codeBlockStart.exec(str)) !== null) {
    const codeBlockStartPos = match.index;
    const codeBlockEndPos = match.index + match[0].length;
    
    // 如果 maxLength 在代码块内，需要保留整个代码块
    if (codeBlockStartPos < maxLength && maxLength < codeBlockEndPos) {
      // 返回到代码块结束位置
      return str.substring(0, codeBlockEndPos);
    }
    
    // 记录最后一个代码块的结束位置
    if (codeBlockEndPos > lastCodeBlockEnd) {
      lastCodeBlockEnd = codeBlockEndPos;
    }
  }
  
  // 判断是不是在 markdown 图片文本内容内
  // 图片格式：![alt text](url) 或 ![alt text](url "title")
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)(?:\s+["']([^"']+)["'])?\)/g;
  let imageMatch: RegExpExecArray | null;
  
  // 重置正则表达式的 lastIndex，因为之前可能被其他正则使用过
  imageRegex.lastIndex = 0;
  
  // 找到所有图片，检查 maxLength 是否在某个图片内
  while ((imageMatch = imageRegex.exec(str)) !== null) {
    const imageStartPos = imageMatch.index;
    const imageEndPos = imageMatch.index + imageMatch[0].length;
    
    // 如果 maxLength 在图片语法内，需要保留整个图片
    if (imageStartPos < maxLength && maxLength < imageEndPos) {
      // 返回到图片结束位置
      return str.substring(0, imageEndPos);
    }
  }
  
  // 如果不在代码块和图片内，从 maxLength 开始向后查找合适的截断点
  // 优先查找标点符号  
  const punctuationRegex = /[。！？]/;
  for (let i = maxLength; i < str.length; i++) {
    if (punctuationRegex.test(str[i])) {
      return str.substring(0, i + 1);
    }
  }
  
  // 其次查找换行符 \n
  const newlineIndex = str.indexOf('\n', maxLength);
  if (newlineIndex !== -1 && newlineIndex < maxLength + 100) {
    return str.substring(0, newlineIndex);
}
  
  // 如果都没找到合适的截断点，返回完整内容
  return str;
}

async function parseMiniMarkdown() {
  // 防止重复解析相同内容
  if (isParsing.value || lastParsedBody.value === props.Markdown.body) {
    return;
  }

  isParsing.value = true;
  try {
    const miniBody = MiniBody(props.Markdown.body);
    const parsed = await m.parseMarkdownHTML(miniBody);
    
    // 只有在内容真正变化时才更新
    if (parsed !== miniMarkdownHTML.value) {
      miniMarkdownHTML.value = parsed;
      lastParsedBody.value = props.Markdown.body;
      
      // 等待 DOM 更新后渲染 mermaid
      await nextTick();
      renderMermaid();
    }
  } finally {
    isParsing.value = false;
  }
}

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
  
  // 只渲染当前组件的 mermaid 图表
  const container = document.getElementById(`miniMD-${props.Markdown.number}`);
  if (container) {
    // 使用 setTimeout 确保 DOM 完全渲染
    renderTimer = window.setTimeout(() => {
      // mermaid.run() 会自动查找容器内的 .mermaid 元素
      mermaid.run();
      isRendering.value = false;
      renderTimer = null;
    }, 0);
  } else {
    isRendering.value = false;
  }
}

onMounted(() => {
  parseMiniMarkdown();
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (renderTimer !== null) {
    clearTimeout(renderTimer);
    renderTimer = null;
  }
  isRendering.value = false;
});

// 只在内容真正变化时渲染，避免 onUpdated 重复触发
watch(() => props.Markdown.body, () => {
  parseMiniMarkdown();
}, { immediate: false });

function scrollToTop() {
  window.scrollTo({
    top: 0,
  });
}
</script>
<style scoped>
.removeMarginBottom {
  margin-bottom: 0rem;
}

.removeA {
  text-decoration: none;
}

.card-dark {
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.header-dark {
  background-color: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.125);
}

.footer-dark {
  background-color: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.125);
}

.text-muted {
  --bs-text-opacity: 1;
  color: #6c757d !important;
}

.text-muted+.text-muted {
  margin-left: 1rem;
}
</style>
