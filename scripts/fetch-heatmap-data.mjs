/**
 * 拉取近一年 GitHub / 力扣热力图数据，写入 public/data/activity-heatmap.json
 * 由 GitHub Actions 每日执行，或本地 npm run fetch-heatmap
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/data");
const OUT_FILE = path.join(OUT_DIR, "activity-heatmap.json");

const GITHUB_USER = process.env.VITE_GITHUB_OWNER || "RedCrazyGhost";
const LEETCODE_SLUG = (
  process.env.VITE_LEETCODE_USER_SLUG || "redcrazyghost"
).toLowerCase();
const LEETCODE_GRAPHQL =
  process.env.VITE_LEETCODE_GRAPHQL_URL ||
  "https://leetcode.cn/graphql/noj-go/";

const HEATMAP_DAYS = 365;

const LEETCODE_QUERY = `
  query userProfileCalendar($userSlug: String!, $year: Int) {
    userCalendar(userSlug: $userSlug, year: $year) {
      submissionCalendar
    }
  }
`;

function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildLastNDates(days) {
  const dates = [];
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(formatLocalDate(d));
  }
  return dates;
}

function parseSubmissionCalendar(raw, allowed) {
  const record = {};
  if (!raw) return record;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return record;
  }
  for (const [ts, count] of Object.entries(parsed)) {
    const n = Number(count);
    if (!n || n <= 0) continue;
    const dateStr = formatLocalDate(new Date(Number(ts) * 1000));
    if (!allowed.has(dateStr)) continue;
    record[dateStr] = (record[dateStr] ?? 0) + n;
  }
  return record;
}

async function fetchGithub(allowed) {
  const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(GITHUB_USER)}?y=last`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  const record = {};
  for (const item of data.contributions ?? []) {
    if (!allowed.has(item.date)) continue;
    if (item.count > 0) record[item.date] = item.count;
  }
  return record;
}

async function fetchLeetcodeYear(year, allowed) {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://leetcode.cn",
      Referer: `https://leetcode.cn/u/${LEETCODE_SLUG}/`,
      "x-operation-name": "userProfileCalendar",
    },
    body: JSON.stringify({
      query: LEETCODE_QUERY,
      variables: { userSlug: LEETCODE_SLUG, year },
      operationName: "userProfileCalendar",
    }),
  });
  if (!res.ok) throw new Error(`LeetCode GraphQL ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "LeetCode GraphQL error");
  }
  return parseSubmissionCalendar(
    json.data?.userCalendar?.submissionCalendar,
    allowed,
  );
}

async function fetchLeetcode(allowed) {
  const y = new Date().getFullYear();
  const parts = await Promise.allSettled(
    [y, y - 1, y - 2].map((year) => fetchLeetcodeYear(year, allowed)),
  );
  const merged = {};
  for (const p of parts) {
    if (p.status === "fulfilled") {
      Object.assign(merged, p.value);
    }
  }
  if (Object.keys(merged).length === 0) {
    const rejected = parts.find((p) => p.status === "rejected");
    if (rejected) throw rejected.reason;
  }
  return merged;
}

async function main() {
  const allowed = new Set(buildLastNDates(HEATMAP_DAYS));
  const sources = {};

  const tasks = [
    ["github", () => fetchGithub(allowed)],
    ["leetcode", () => fetchLeetcode(allowed)],
  ];

  for (const [id, fn] of tasks) {
    try {
      sources[id] = await fn();
      console.log(
        `[fetch-heatmap] ${id}: ${Object.keys(sources[id]).length} days`,
      );
    } catch (err) {
      console.warn(`[fetch-heatmap] ${id} failed:`, err?.message ?? err);
      sources[id] = {};
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    sources,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");
  console.log(`[fetch-heatmap] wrote ${OUT_FILE}`);
}

main().catch((err) => {
  console.error("[fetch-heatmap] fatal:", err);
  process.exit(1);
});
