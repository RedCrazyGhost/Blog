export interface ImageItem {
  path: string;
  alt: string;
  title: string;
  desc: string;
  country: string;
  isLoading: boolean;
  shouldLoad?: boolean;
  // 位置信息
  location?: {
    lat: number;  // 纬度
    lng: number;  // 经度
    city?: string;  // 城市（可选）
    province?: string;  // 省份（可选）
  };
}
