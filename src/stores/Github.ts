import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMarkdownStore } from "./Markdown";
import router from "@/router";
import type { GithubConfig, GithubIssue } from "@/types/github";
import { GithubService } from "@/service/github";
import { handleError, formatError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";
import { config } from "@/config";

export const useGithubStore = defineStore("Github", () => {
  const m = useMarkdownStore();
  const currentPage = ref(1);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const Github = ref<GithubConfig>({
    owner: config.github.owner,
    repo: config.github.repo,
  });
  const githubService = new GithubService(Github.value);

  async function GetIssue(id: number, forceRefresh: boolean = false): Promise<void> {
    try {
      loading.value = true;
      error.value = null;
      const issue = await githubService.getIssue(id, forceRefresh);
      if (!issue) {
        error.value = '文章不存在';
        router.push({ name: "404" });
        return;
      }
      m.SetCurrentMarkdown(issue);
    } catch (err) {
      const errorInfo = handleError(err);
      error.value = formatError(err);
      logger.error('获取文章失败:', errorInfo);
      router.push({ name: "404" });
    } finally {
      loading.value = false;
    }
  }

  async function GetIssues(page: number = currentPage.value, size: number = 10, forceRefresh: boolean = false): Promise<GithubIssue[]> {
    try {
      loading.value = true;
      error.value = null;
      
      // 首次加载（第一页）时，不强制刷新，允许使用缓存
      // 如果缓存中有数据，会先返回缓存，然后后台更新
      const issues = await githubService.getIssues(page, size, forceRefresh);
      
      if (issues.length > 0) {
        currentPage.value = page;
        // 将获取到的 issues 添加到 Markdown store（会自动按 number 降序排序）
        issues.forEach((issue) => {
          m.AddMarkdown({
            number: issue.number,
            body: issue.body,
            title: issue.title,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            labels: issue.labels.map((label) => ({
              id: label.id,
              name: label.name,
              color: label.color,
              description: label.description || '',
            })),
          });
        });
      }
      return issues;
    } catch (err) {
      const errorInfo = handleError(err);
      error.value = formatError(err);
      logger.error('获取文章列表失败:', errorInfo);
      return [];
    } finally {
      loading.value = false;
    }
  }

  const GetGithubRepo = computed(() => Github.value.repo);
  const GetGithubOwner = computed(() => Github.value.owner);

  function clearError() {
    error.value = null;
  }

  return {
    currentPage,
    loading,
    error,
    GetGithubRepo,
    GetGithubOwner,
    GetIssues,
    GetIssue,
    clearError,
  };
});
