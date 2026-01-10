import { Octokit } from "octokit";
import { Cache } from "@/utils/cache";
import type { GithubConfig, GithubIssue } from "@/types/github";
import { config } from "@/config";
import { logger } from "@/utils/logger";

const cache = new Cache<GithubIssue>("github", config.cache.defaultTTL);

export class GithubService {
  private octokit: Octokit;
  private config: GithubConfig;
  private haveNextPackge: boolean;

  constructor(serviceConfig: GithubConfig) {
    this.octokit = new Octokit({
      baseUrl: config.github.apiBaseUrl,
    });
    this.config = serviceConfig;
    this.haveNextPackge = true;
  }
  async getIssue(id: number, forceRefresh: boolean = false): Promise<GithubIssue> {
    // 如果强制刷新，跳过缓存
    if (!forceRefresh) {
    const cachedIssue = cache.get(String(id));
    if (cachedIssue) {
      return cachedIssue as GithubIssue;
    }
    }
    
    // 从 API 获取最新数据
    const response = await this.octokit.rest.issues.get({
      owner: this.config.owner,
      repo: this.config.repo,
      issue_number: id,
    });
    const issue = response.data as GithubIssue;
    // 更新缓存
    cache.set(String(id), issue);
    return issue;
  }

  async getIssues(
    currentPackage: number,
    size: number = 10,
    forceRefresh: boolean = false
  ): Promise<GithubIssue[]> {
    // 如果是第一页且不强制刷新，先尝试从缓存获取
    if (currentPackage === 1 && !forceRefresh) {
      const cachedIssues = this.getCachedIssues(size);
      if (cachedIssues.length > 0) {
        // 返回缓存数据，同时异步获取最新数据更新缓存
        // 注意：这里不等待 API 响应，先返回缓存数据提升用户体验
        this.fetchIssuesFromAPI(currentPackage, size).catch((err) => {
          logger.error('后台更新最新数据失败:', err);
        });
        return cachedIssues;
      }
    }

    // 其他情况（非第一页或强制刷新）直接从 API 获取
    return await this.fetchIssuesFromAPI(currentPackage, size);
  }

  /**
   * 从缓存中获取最新的 issues（按 number 降序）
   */
  private getCachedIssues(size: number): GithubIssue[] {
    const allCached = cache.getAll() as GithubIssue[];
    if (allCached.length === 0) {
      return [];
    }
    
    // 按 number 降序排序（从大到小）
    const sorted = allCached.sort((a, b) => b.number - a.number);
    
    // 返回前 size 个
    return sorted.slice(0, size);
  }

  private async fetchIssuesFromAPI(
    page: number,
    size: number
  ): Promise<GithubIssue[]> {
    try {
      const response = await this.octokit.rest.issues.listForRepo({
        owner: this.config.owner,
        repo: this.config.repo,
        creator: this.config.owner,
        state: "open",
        per_page: size,
        page: page,
      });
      const issues = response.data as GithubIssue[];
      
      if (issues.length < size) {
        this.haveNextPackge = false;
      }
      
      // 缓存所有获取到的 issues（使用 issue number 作为 key）
      issues.forEach((issue) => {
        cache.set(String(issue.number), issue);
      });
      
      return issues;
    } catch (error) {
      logger.error('获取 issues 失败:', error);
      throw error;
    }
  }
}
