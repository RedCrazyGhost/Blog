module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    // 让 ESLint 能正确解析 Vue SFC（<template>/<script>/<style>）
    "plugin:vue/vue3-recommended",
    // 让 ESLint 能正确解析 TS，并启用 unused 相关规则
    "@vue/eslint-config-typescript",
    // 和 Prettier 对齐，避免格式化规则冲突
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  plugins: ["unused-imports"],
  rules: {
    // 配合 npm run lint -- --fix：移除没用的变量/参数
    // 你项目里大量组件名是单词（如 Loading/Tag/Markdown），不建议强制 multi-word
    "vue/multi-word-component-names": "off",
    // unused-imports 能针对未使用的 import 提供自动移除（fix）
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    // 避免 lint --fix 触发全量格式化，优先做 unused 清理
    "prettier/prettier": "off",
    // Markdown 渲染依赖 v-html，这里允许使用
    "vue/no-v-html": "off",
  },
  ignorePatterns: ["dist", "node_modules"],
};
