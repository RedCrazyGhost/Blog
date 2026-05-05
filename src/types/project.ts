/**
 * 个人在线项目卡片数据模型
 * 用于 /projects 页面的项目展示
 */
export interface ProjectItem {
  /** 项目唯一标识，用于 v-for key 与组件内分支判断 */
  id: string;
  /** 项目名称 */
  name: string;
  /** 项目副标题/标语 */
  tagline?: string;
  /** 在线访问地址；未设置或为空时不显示「访问站点」按钮 */
  url?: string;
  /** 项目简介 */
  description: string;
  /** 项目主题，用于 ProjectCard 选择不同的视觉风格分支 */
  theme: "txt" | "sc2" | "mqttz";
  /** FontAwesome 图标 class，例如 "fas fa-book-open" */
  icon: string;
  /** 标签 chips */
  tags: string[];
  /** 项目核心功能/亮点列表 */
  highlights?: string[];
  /** 「访问按钮」文案，未设置时默认「访问站点」（GitHub 项目可设为 "GitHub"） */
  ctaLabel?: string;
  /** 「访问按钮」FontAwesome 图标，未设置时默认外链图标 */
  ctaIcon?: string;
}
