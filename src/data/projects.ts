import type { ProjectItem } from "@/types/project";

/**
 * 个人公开在线项目列表
 * 新增项目时仅追加数组项，并在 ProjectCard 内补充对应主题分支即可
 */
export const projects: ProjectItem[] = [
  {
    id: "txt",
    name: "txt",
    tagline: "帮助人们进行知识巩固的网站",
    url: "https://txt.redcrazyghost.vip",
    description:
      "通过「出题 → 生成 JSON → 答题」三步流程，把碎片知识结构化为可复用的题库；支持本地 JSON 导入导出，离线也能使用。",
    theme: "txt",
    icon: "fas fa-book-open",
    tags: ["Vue", "教育", "JSON 题库", "离线可用"],
    highlights: [
      "Step 1：可视化出题，支持空缺式题目（例：1+1=_2_）",
      "Step 2：一键生成 / 合并 / 导入 JSON 题库",
      "Step 3：基于题库进行知识巩固训练",
    ],
  },
  {
    id: "sc2",
    name: "SC2 Tools",
    tagline: "星际争霸2 工具站 - 经验计算器与练级工具",
    url: "https://sc2.redcrazyghost.vip",
    description:
      "专为《星际争霸2》合作模式玩家打造的轻量工具集合。原生 HTML/CSS/JS 构建，首屏可抓取、加载快、移动端友好。",
    theme: "sc2",
    icon: "fas fa-gamepad",
    tags: ["原生 JS", "星际争霸2", "工具集合", "移动端友好"],
    highlights: [
      "单局游戏经验计算（难度 / 随机地图 / 首胜 / 突变奖励）",
      "合作模式经验计算器，可同步到日历目标经验",
      "指挥官 1-15 级与精通 0-90 级经验列表",
      "每周突变奖励经验列表（休闲到残酷全档）",
    ],
  },
];
