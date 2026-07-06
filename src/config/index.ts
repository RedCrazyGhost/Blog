import type { Profile } from "@/types/profile";

/**
 * 应用配置管理
 * 统一管理所有配置项，支持环境变量
 */

export const config = {
  github: {
    owner: import.meta.env.VITE_GITHUB_OWNER || "RedCrazyGhost",
    repo: import.meta.env.VITE_GITHUB_REPO || "blog",
    apiBaseUrl:
      import.meta.env.VITE_GITHUB_API_BASE_URL || "https://api.github.com",
  },
  app: {
    version: import.meta.env.VITE_APP_VERSION || "v0.0.0",
    /** 关于页个人信息，数据模型见 @/types/profile */
    author: {
      name: import.meta.env.VITE_APP_AUTHOR_NAME || "RedCrazyGhost",
      avatar: import.meta.env.VITE_APP_AUTHOR_AVATAR || "",
      bio: import.meta.env.VITE_APP_AUTHOR_BIO || "3年 Golang 开发经验 | 上海",
      links: [
        {
          label: "GitHub",
          url: "https://github.com/RedCrazyGhost",
          icon: "fab fa-github",
        },
        {
          label: "邮箱",
          url: "mailto:940842903@qq.com",
          icon: "fas fa-envelope",
        },
        { label: "电话", url: "tel:17671240514", icon: "fas fa-phone" },
      ] as Profile["links"],
    } satisfies Profile,
    website: {
      archivalInformation:
        import.meta.env.VITE_APP_ARCHIVAL_INFORMATION || "鄂ICP备19031343号-1",
    },
  },
  cache: {
    defaultTTL: Number(import.meta.env.VITE_CACHE_TTL) || 30, // 分钟
  },
  heatmap: {
    /** 本地静态 JSON（开发/离线回退） */
    snapshotPath:
      import.meta.env.VITE_HEATMAP_SNAPSHOT_PATH ||
      "/data/activity-heatmap.json",
    /** 远程 JSON 源（按顺序尝试；sync 推送后无需重新部署站点） */
    remoteSnapshotUrls: [
      import.meta.env.VITE_HEATMAP_REMOTE_URL ||
        `https://raw.githubusercontent.com/${import.meta.env.VITE_GITHUB_OWNER || "RedCrazyGhost"}/${import.meta.env.VITE_GITHUB_REPO || "blog"}/${import.meta.env.VITE_GITHUB_BRANCH || "main"}/public/data/activity-heatmap.json`,
      import.meta.env.VITE_HEATMAP_JSDELIVR_URL ||
        `https://cdn.jsdelivr.net/gh/${import.meta.env.VITE_GITHUB_OWNER || "RedCrazyGhost"}/${import.meta.env.VITE_GITHUB_REPO || "blog"}@${import.meta.env.VITE_GITHUB_BRANCH || "main"}/public/data/activity-heatmap.json`,
    ],
    /** 设为 false 时仅读本地 snapshotPath */
    remoteEnabled: import.meta.env.VITE_HEATMAP_REMOTE_ENABLED !== "false",
    sources: {
      github: {
        enabled: import.meta.env.VITE_HEATMAP_GITHUB_ENABLED !== "false",
        color: import.meta.env.VITE_HEATMAP_GITHUB_COLOR || "#216e39",
      },
      leetcode: {
        enabled: import.meta.env.VITE_HEATMAP_LEETCODE_ENABLED !== "false",
        color: import.meta.env.VITE_HEATMAP_LEETCODE_COLOR || "#ffa116",
      },
    },
  },
  font: {
    familyName: import.meta.env.VITE_FONT_FAMILY_NAME || "HYCuYuanJ",
    fallback: import.meta.env.VITE_FONT_FALLBACK || "system-ui",
    urls: [
      import.meta.env.VITE_FONT_URL_LOCAL || "/fonts/HYCuYuanJ.ttf",
      import.meta.env.VITE_FONT_URL_CDN1 ||
        "https://cdn.jsdelivr.net/gh/RedCrazyGhost/CDN/TTF/HYCuYuanJ-Blog-RedCrazyGhost.ttf",
      import.meta.env.VITE_FONT_URL_CDN2 ||
        "https://cdn.jsdelivr.net/gh/RedCrazyGhost/CDN/TTF/HYCuYuanJ.ttf",
    ],
    timeout: Number(import.meta.env.VITE_FONT_LOAD_TIMEOUT) || 10000, // 毫秒
  },
} as const;

export type AppConfig = typeof config;
