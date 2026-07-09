/**
 * 拉取近一年 GitHub / 力扣热力图数据，写入 public/data/activity-heatmap.json
 * 由 GitHub Actions 每日执行，或本地 npm run fetch-heatmap
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/data");
const OUT_FILE = path.join(OUT_DIR, "activity-heatmap.json");
const STEAM_SNAPSHOT_FILE = path.join(OUT_DIR, "steam-playtime-snapshots.json");

const GITHUB_USER = process.env.VITE_GITHUB_OWNER || "RedCrazyGhost";
const LEETCODE_SLUG = (
  process.env.VITE_LEETCODE_USER_SLUG || "redcrazyghost"
).toLowerCase();
const LEETCODE_GRAPHQL =
  process.env.VITE_LEETCODE_GRAPHQL_URL ||
  "https://leetcode.cn/graphql/noj-go/";
const STEAM_API_KEY = process.env.STEAM_API_KEY || "";
const STEAM_ID = process.env.STEAM_ID || "";

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

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysBetween(fromDateStr, toDateStr) {
  const from = parseLocalDate(fromDateStr);
  const to = parseLocalDate(toDateStr);
  return Math.round((to - from) / 86_400_000);
}

function getYesterdayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 1);
  return formatLocalDate(d);
}

function minutesToHours(minutes) {
  return Math.round((minutes / 60) * 10) / 10;
}

function pruneRecord(record, allowed) {
  const pruned = {};
  for (const [date, value] of Object.entries(record)) {
    if (allowed.has(date) && value > 0) {
      pruned[date] = value;
    }
  }
  return pruned;
}

function normalizeSteamSource(raw) {
  if (!raw || typeof raw !== "object") {
    return { games: {}, days: {} };
  }
  if (raw.days && typeof raw.days === "object") {
    return {
      games: raw.games ?? {},
      days: raw.days ?? {},
    };
  }
  return { games: {}, days: {} };
}

function pruneSteamData(steamData, allowed) {
  const games = { ...steamData.games };
  const days = {};
  for (const [date, gameHours] of Object.entries(steamData.days ?? {})) {
    if (!allowed.has(date)) continue;
    const prunedDay = {};
    for (const [appId, hours] of Object.entries(gameHours ?? {})) {
      if (hours > 0) {
        prunedDay[appId] = hours;
        if (!games[appId]) games[appId] = appId;
      }
    }
    if (Object.keys(prunedDay).length > 0) {
      days[date] = prunedDay;
    }
  }
  return { games, days };
}

function steamDayCount(steamData) {
  return Object.keys(steamData.days ?? {}).length;
}

async function readJsonFile(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function diffPlaytimePerGame(previous, current) {
  const result = {};
  const ids = new Set([
    ...Object.keys(previous ?? {}),
    ...Object.keys(current ?? {}),
  ]);
  for (const id of ids) {
    const delta = (current[id] ?? 0) - (previous[id] ?? 0);
    if (delta <= 0) continue;
    const hours = minutesToHours(delta);
    if (hours > 0) result[id] = hours;
  }
  return result;
}

function buildPlaytimeMap(games) {
  const playtime = {};
  const names = {};
  for (const game of games ?? []) {
    const id = String(game.appid);
    playtime[id] = game.playtime_forever ?? 0;
    if (game.name) names[id] = game.name;
  }
  return { playtime, names };
}

async function fetchSteamOwnedGames() {
  const url = new URL(
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
  );
  url.searchParams.set("key", STEAM_API_KEY);
  url.searchParams.set("steamid", STEAM_ID);
  url.searchParams.set("format", "json");
  url.searchParams.set("include_appinfo", "true");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam API ${res.status}`);
  const data = await res.json();
  return data.response?.games ?? [];
}

function resolveSteamTargetDate(snapshotDate) {
  const today = formatLocalDate(new Date());
  const gap = daysBetween(snapshotDate, today);
  if (gap <= 0) return null;
  if (gap === 1) return getYesterdayDate();
  return today;
}

async function fetchSteam(allowed) {
  if (!STEAM_API_KEY || !STEAM_ID) {
    console.warn("[fetch-heatmap] steam skipped: missing STEAM_API_KEY or STEAM_ID");
    const existing = await readJsonFile(OUT_FILE);
    return pruneSteamData(
      normalizeSteamSource(existing?.sources?.steam),
      allowed,
    );
  }

  const existingHeatmap = await readJsonFile(OUT_FILE);
  const steamData = normalizeSteamSource(existingHeatmap?.sources?.steam);
  const snapshotFile = (await readJsonFile(STEAM_SNAPSHOT_FILE)) ?? {
    games: {},
    snapshotDate: null,
    playtime: {},
  };

  const games = await fetchSteamOwnedGames();
  const { playtime: currentPlaytime, names } = buildPlaytimeMap(games);
  const gamesMap = { ...snapshotFile.games, ...names };
  const today = formatLocalDate(new Date());

  if (snapshotFile.snapshotDate && snapshotFile.playtime) {
    const targetDate = resolveSteamTargetDate(snapshotFile.snapshotDate);
    if (targetDate && allowed.has(targetDate)) {
      const perGame = diffPlaytimePerGame(
        snapshotFile.playtime,
        currentPlaytime,
      );
      if (Object.keys(perGame).length > 0) {
        steamData.days[targetDate] = perGame;
      } else {
        delete steamData.days[targetDate];
      }
    }
  } else {
    console.log("[fetch-heatmap] steam: baseline snapshot saved, no heatmap data yet");
  }

  steamData.games = gamesMap;

  const nextSnapshot = {
    games: gamesMap,
    snapshotDate: today,
    playtime: currentPlaytime,
  };
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(
    STEAM_SNAPSHOT_FILE,
    JSON.stringify(nextSnapshot, null, 2),
    "utf8",
  );

  return pruneSteamData(steamData, allowed);
}

async function main() {
  const allowed = new Set(buildLastNDates(HEATMAP_DAYS));
  const sources = {};

  const tasks = [
    ["github", () => fetchGithub(allowed)],
    ["leetcode", () => fetchLeetcode(allowed)],
    ["steam", () => fetchSteam(allowed)],
  ];

  for (const [id, fn] of tasks) {
    try {
      sources[id] = await fn();
      const size =
        id === "steam" ? steamDayCount(sources[id]) : Object.keys(sources[id]).length;
      console.log(`[fetch-heatmap] ${id}: ${size} days`);
    } catch (err) {
      console.warn(`[fetch-heatmap] ${id} failed:`, err?.message ?? err);
      sources[id] = id === "steam" ? { games: {}, days: {} } : {};
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
