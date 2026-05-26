import hljs from "highlight.js";
import { useThemeStore } from "@/stores/Theme";

function wrapCodeBlock(preHtml: string): string {
  return `<div class="code-block"><button type="button" class="code-copy-btn" aria-label="复制代码" data-code-copy>复制</button>${preHtml}</div>`;
}

export const CodeRenderer = {
  code(code: string, infostring: string | undefined, escaped: boolean) {
    if (!infostring) return "";

    const theme = useThemeStore();
    const themeColor = theme.GetThemeColor;

    switch (infostring.toLowerCase()) {
      case "mysql":
        return wrapCodeBlock(
          `<pre class="language-mysql pre-${themeColor}"><code class="language-mysql">${
            hljs.highlight(code, { language: "sql", ignoreIllegals: escaped })
              .value
          }</code></pre>`,
        );
      case "mermaid":
        return `<pre class="mermaid">${code}</pre>`;
      default:
        return wrapCodeBlock(
          `<pre class="language-${infostring} pre-${themeColor}"><code class="language-${infostring}">${
            hljs.highlight(code, {
              language: infostring,
              ignoreIllegals: escaped,
            }).value
          }</code></pre>`,
        );
    }
  },
};
