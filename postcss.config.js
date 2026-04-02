import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import purgecss from "@fullhuman/postcss-purgecss";

const isProd = process.env.NODE_ENV === "production";

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    // 额外压缩：只在生产环境启用，针对非 Tailwind 的样式/选择器做二次清理
    isProd
      ? purgecss({
          content: ["./index.html", "./src/**/*.{vue,ts,tsx,js,jsx}"],
          defaultExtractor: (content) =>
            content.match(/[A-Za-z0-9-_:/]+/g) || [],
          safelist: ["html", "body", "#app"],
        })
      : null,
  ].filter(Boolean),
};
