#!/usr/bin/env node
/**
 * 将 package.json / package-lock.json 的 patch 版本 +1（v1.0.13 → v1.0.14）
 * 成功时向 stdout 输出新版本号
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseVersion(version) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`无法解析版本号: ${version}`);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function formatVersion({ major, minor, patch }) {
  return `v${major}.${minor}.${patch}`;
}

function bumpPatch(version) {
  const parsed = parseVersion(version);
  return formatVersion({ ...parsed, patch: parsed.patch + 1 });
}

const pkgPath = join(root, "package.json");
const lockPath = join(root, "package-lock.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const nextVersion = bumpPatch(pkg.version);

pkg.version = nextVersion;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

const lock = JSON.parse(readFileSync(lockPath, "utf8"));
lock.version = nextVersion;
if (lock.packages?.[""]) {
  lock.packages[""].version = nextVersion;
}
writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);

process.stdout.write(nextVersion);
