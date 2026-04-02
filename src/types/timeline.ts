export interface TimelineItem {
  title: string;
  description?: string;

  /** 开始时间（用于区间标注） */
  startDate?: string;
  /** 结束时间（用于区间标注/排序） */
  endDate?: string;

  /** 兼容旧数据：单一时间点 */
  date?: string;
  icon?: string | string[];

  /** 工作职责 */
  responsibilities?: string[];
  /** 工作产出 */
  deliverables?: string[];
}
