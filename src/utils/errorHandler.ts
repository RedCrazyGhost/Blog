/**
 * 统一错误处理
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    // 保持堆栈跟踪 (V8/Node.js specific)
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, AppError);
    }
  }
}

export interface ErrorInfo {
  message: string;
  code?: string;
  statusCode?: number;
  stack?: string;
}

/**
 * 处理错误并返回错误信息
 */
export function handleError(error: unknown): ErrorInfo {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
    };
  } else if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  } else {
    return {
      message: 'Unknown error occurred',
    };
  }
}

/**
 * 格式化错误信息用于显示
 */
export function formatError(error: unknown): string {
  const errorInfo = handleError(error);
  if (errorInfo.code) {
    return `[${errorInfo.code}] ${errorInfo.message}`;
  }
  return errorInfo.message;
}

