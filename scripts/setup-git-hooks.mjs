#!/usr/bin/env node
/** 将 Git hooks 目录指向仓库内的 .githooks（本地开发环境，跳过 CI） */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

if (!existsSync(".git") || process.env.CI) {
  process.exit(0);
}

try {
  execSync("git config core.hooksPath .githooks", { stdio: "inherit" });
} catch {
  // 非 Git 仓库或权限不足时静默跳过
}
