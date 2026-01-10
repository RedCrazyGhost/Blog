import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { config } from "@/config";
import { logger } from "@/utils/logger";

type FontLoadStatus = 'idle' | 'loading' | 'success' | 'error';

export const useFontStore = defineStore("Font", () => {
  const Font = ref({
    fontFamilyName: config.font.familyName,
    loadUrls: config.font.urls,
    useFont: config.font.fallback,
    status: 'idle' as FontLoadStatus,
    error: null as string | null,
  });

  /**
   * 生成字体 URL 字符串，支持多种格式
   */
  function getFontFaceSource(): string {
    // 按优先级顺序：WOFF2 > WOFF > TTF
    const formatUrls: string[] = [];
    
    Font.value.loadUrls.forEach(baseUrl => {
      // 尝试不同格式
      const woff2Url = baseUrl.replace(/\.(ttf|woff|woff2)$/i, '.woff2');
      const woffUrl = baseUrl.replace(/\.(ttf|woff|woff2)$/i, '.woff');
      const ttfUrl = baseUrl.replace(/\.(ttf|woff|woff2)$/i, '.ttf');
      
      // 按优先级添加（浏览器会自动选择支持的格式）
      formatUrls.push(`url("${woff2Url}") format("woff2")`);
      formatUrls.push(`url("${woffUrl}") format("woff")`);
      formatUrls.push(`url("${ttfUrl}") format("truetype")`);
    });
    
    return formatUrls.join(', ');
  }

  /**
   * 加载字体，带超时和错误处理
   */
  async function LoadFont(timeout?: number): Promise<void> {
    const loadTimeout = timeout || config.font.timeout;
    if (Font.value.status === 'loading') {
      return; // 已经在加载中
    }

    Font.value.status = 'loading';
    Font.value.error = null;

    try {
      const font = new FontFace(
        Font.value.fontFamilyName,
        getFontFaceSource(),
        {
          display: 'swap', // 优化字体显示策略
        }
      );

      document.fonts.add(font);

      // 创建超时 Promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`字体加载超时（${loadTimeout}ms）`));
        }, loadTimeout);
      });

      // 加载字体（带超时）
      await Promise.race([font.load(), timeoutPromise]);

      Font.value.useFont = Font.value.fontFamilyName;
      Font.value.status = 'success';
      logger.log('字体加载成功:', Font.value.fontFamilyName);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '字体加载失败';
      Font.value.error = errorMessage;
      Font.value.status = 'error';
      Font.value.useFont = config.font.fallback; // 使用后备字体
      logger.error('字体加载失败:', error);
      
      // 如果所有 URL 都失败，确保使用系统字体
      if (Font.value.useFont === Font.value.fontFamilyName) {
        Font.value.useFont = config.font.fallback;
      }
    }
  }

  const GetUseFont = computed(() => {
    return Font.value.useFont;
  });

  const GetIsFontLoaded = computed(() => {
    return Font.value.status === 'success';
  });

  const GetFontStatus = computed(() => {
    return Font.value.status;
  });

  const GetFontError = computed(() => {
    return Font.value.error;
  });

  return {
    GetIsFontLoaded,
    GetUseFont,
    GetFontStatus,
    GetFontError,
    LoadFont,
  };
});
