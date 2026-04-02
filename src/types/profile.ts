/** 个人资料中的单个链接（如 GitHub、邮箱、博客） */
export interface ProfileLink {
  label: string;
  url: string;
  /** FontAwesome 图标（如：fab fa-github、fas fa-envelope） */
  icon?: string;
}

/** 关于页「个人信息」要填写的数据模型 */
export interface Profile {
  /** 姓名 / 昵称 */
  name: string;
  /** 头像图片 URL */
  avatar?: string;
  /** 个人简介 */
  bio?: string;
  /** 社交或个人链接列表 */
  links?: ProfileLink[];
}
