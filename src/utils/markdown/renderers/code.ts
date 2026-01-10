import hljs from 'highlight.js';
import { useThemeStore } from '@/stores/Theme';

export const CodeRenderer = {
    code(code: string, infostring: string | undefined, escaped: boolean) {
        if (!infostring) return "";
        
        const theme = useThemeStore();
        const themeColor = theme.GetThemeColor;
        
        switch(infostring.toLowerCase()) {
            case "mysql":
                return `<pre class="language-mysql pre-${themeColor}"><code class="language-mysql">${hljs.highlight(code, {language: "sql", ignoreIllegals: escaped }).value}</code></pre>`;
            case "mermaid":
                return `<pre class="mermaid">${code}</pre>`;
            default:
                return `<pre class="language-${infostring} pre-${themeColor}"><code class="language-${infostring}">${hljs.highlight(code, {language: infostring, ignoreIllegals: escaped }).value}</code></pre>`;
        }
    }
};