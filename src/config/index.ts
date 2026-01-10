/**
 * 应用配置管理
 * 统一管理所有配置项，支持环境变量
 */

export const config = {
  github: {
    owner: import.meta.env.VITE_GITHUB_OWNER || 'RedCrazyGhost',
    repo: import.meta.env.VITE_GITHUB_REPO || 'blog',
    apiBaseUrl: import.meta.env.VITE_GITHUB_API_BASE_URL || 'https://api.github.com',
  },
  app: {
    version: import.meta.env.VITE_APP_VERSION || 'v1.0.11',
    author: {
      name: import.meta.env.VITE_APP_AUTHOR_NAME || 'RedCrazyGhost',
    },
    website: {
      archivalInformation: import.meta.env.VITE_APP_ARCHIVAL_INFORMATION || '鄂ICP备19031343号-1',
    },
  },
  cache: {
    defaultTTL: Number(import.meta.env.VITE_CACHE_TTL) || 30, // 分钟
  },
  font: {
    familyName: import.meta.env.VITE_FONT_FAMILY_NAME || 'HYCuYuanJ',
    fallback: import.meta.env.VITE_FONT_FALLBACK || 'system-ui',
    urls: [
      import.meta.env.VITE_FONT_URL_LOCAL || '/fonts/HYCuYuanJ.ttf',
      import.meta.env.VITE_FONT_URL_CDN1 || 'https://cdn.jsdelivr.net/gh/RedCrazyGhost/CDN/TTF/HYCuYuanJ-Blog-RedCrazyGhost.ttf',
      import.meta.env.VITE_FONT_URL_CDN2 || 'https://cdn.jsdelivr.net/gh/RedCrazyGhost/CDN/TTF/HYCuYuanJ.ttf',
    ],
    timeout: Number(import.meta.env.VITE_FONT_LOAD_TIMEOUT) || 10000, // 毫秒
  },
} as const;

export type AppConfig = typeof config;

