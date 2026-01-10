/**
 * 统一日志管理
 * 开发环境输出日志，生产环境可配置
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * 普通日志
   */
  log: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[LOG]', ...args);
    }
  },

  /**
   * 错误日志（始终输出）
   */
  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args);
  },

  /**
   * 警告日志
   */
  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * 信息日志
   */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * 调试日志
   */
  debug: (...args: unknown[]): void => {
    if (isDev && import.meta.env.VITE_DEBUG === 'true') {
      console.debug('[DEBUG]', ...args);
    }
  },
};

