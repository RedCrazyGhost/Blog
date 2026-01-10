import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { marked } from "marked";
import mermaid from "mermaid";
import type { MarkdownContent } from "@/types/markdown";
import type { GithubIssue } from "@/types/github";
import { MarkdownService } from "@/service/markdown";

mermaid.initialize({
  startOnLoad: true,
});

const markdownService = new MarkdownService();

export const useMarkdownStore = defineStore("Markdown", () => {
  const currentMarkdown = ref<GithubIssue | null>(null);
  const Markdowns = ref<MarkdownContent[]>([]);
  const parsedHTML = ref<string>("");
  const isParsing = ref(false);

  function SetCurrentMarkdown(data: GithubIssue | null) {
    currentMarkdown.value = data;
    // 异步解析 markdown
    if (data && data.body) {
      parseMarkdownAsync(data.body);
    } else {
      parsedHTML.value = "";
    }
  }

  async function parseMarkdownAsync(markdownBody: string) {
    if (isParsing.value) return;
    isParsing.value = true;
    try {
      parsedHTML.value = await markdownService.parseHTML(markdownBody);
    } catch (error) {
      parsedHTML.value = "解析 Markdown 时出错";
    } finally {
      isParsing.value = false;
    }
  }

  // 二分查找插入，如果存在则直接获取
  function AddMarkdown(data: MarkdownContent) {
    const len = Markdowns.value.length;
    if (len == 0) {
      Markdowns.value.push(data);
    } else {
      let left = 0,
        right = len - 1,
        ans = len;
      while (left <= right) {
        let mid = ((right - left) >> 1) + left;
        if (data.number > Markdowns.value[mid].number) {
          ans = mid;
          right = mid - 1;
        } else if (data.number == Markdowns.value[mid].number) {
          return;
        } else {
          left = mid + 1;
        }
      }
      Markdowns.value.splice(ans, 0, data);
    }
  }

  const parseCurrentMarkdownHTML = computed(() => {
    return parsedHTML.value;
  });

  async function parseMarkdownHTML(markdownBody: string): Promise<string> {
    return await markdownService.parseHTML(markdownBody);
  }

  const GetMarkdowns = computed(() => {
    return Markdowns.value;
  });

  const GetCurrentMarkdown = computed(() => {
    return currentMarkdown.value;
  });

  return {
    SetCurrentMarkdown,
    AddMarkdown,
    GetMarkdowns,
    GetCurrentMarkdown,
    parseMarkdownHTML,
    parseCurrentMarkdownHTML,
  };
});
