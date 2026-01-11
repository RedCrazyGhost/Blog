<template>
  <div class="image-map-container" :class="theme.GetBackgroundColorStyle">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useThemeStore } from "@/stores/Theme";
import { useCDNStore } from "@/stores/CDN";
import type { ImageItem } from "@/types/image";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import * as MarkerClusterGroup from "leaflet.markercluster";

const props = defineProps<{
  images: ImageItem[];
  groupedImages: Record<string, ImageItem[]>;
  galleryIds: Record<string, string>;
}>();

const theme = useThemeStore();
const CDN = useCDNStore();
const mapContainer = ref<HTMLElement | null>(null);

let map: L.Map | null = null;
let countryMarkers: L.Marker[] = [];
let imageMarkers: L.Marker[] = [];
let currentTileLayer: L.TileLayer | null = null;
let imageMarkerCluster: L.MarkerClusterGroup | null = null;

// 计算国家中心点
function calculateCountryCenter(images: ImageItem[]): [number, number] | null {
  const locations = images
    .filter(img => img.location?.lat && img.location?.lng)
    .map(img => [img.location!.lat, img.location!.lng] as [number, number]);
  
  if (locations.length === 0) return null;
  
  if (locations.length === 1) {
    return locations[0];
  }
  
  // 计算所有位置的中心点
  const avgLat = locations.reduce((sum, [lat]) => sum + lat, 0) / locations.length;
  const avgLng = locations.reduce((sum, [, lng]) => sum + lng, 0) / locations.length;
  
  return [avgLat, avgLng];
}

// 创建图片图标
function createImageIcon(imagePath: string, size: number = 60): L.DivIcon {
  const imageUrl = CDN.getURL(imagePath);
  return L.divIcon({
    className: 'image-marker-icon',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      position: relative;
    ">
      <img 
        src="${imageUrl}" 
        style="
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: block;
        "
        loading="lazy"
        onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:${size}px;height:${size}px;background:#dc3545;border-radius:8px;border:3px solid white;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;\\'>图片</div>'"
      />
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

// 创建国家标记（使用第一张图片作为标记）
function createCountryMarkers() {
  if (!map) return;
  
  // 清除现有标记
  countryMarkers.forEach(marker => map?.removeLayer(marker));
  countryMarkers = [];
  
  Object.entries(props.groupedImages).forEach(([country, images]) => {
    const center = calculateCountryCenter(images);
    if (!center) return;
    
    const galleryId = props.galleryIds[country];
    if (!galleryId) return;
    
    // 使用第一张有位置信息的图片作为标记图标
    const firstImage = images.find(img => img.location) || images[0];
    if (!firstImage) return;
    
    const marker = L.marker(center, {
      icon: createImageIcon(firstImage.path, 80)
    }).addTo(map!);
    
    marker.on('click', () => {
      const element = document.getElementById(galleryId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 高亮效果 - 使用 box-shadow 配合 border-radius 以贴合组件圆角
        // 元素本身已经有 border-radius: 12px，box-shadow 会自动贴合圆角
        element.style.transition = 'box-shadow 0.3s ease';
        // 使用多层 box-shadow：内层边框效果 + 外层发光效果，都会贴合圆角
        element.style.boxShadow = 'inset 0 0 0 3px rgba(13, 110, 253, 0.6), 0 0 0 4px rgba(13, 110, 253, 0.4), 0 0 20px rgba(13, 110, 253, 0.3)';
        setTimeout(() => {
          element.style.boxShadow = '';
        }, 2000);
      }
    });
    
    countryMarkers.push(marker);
  });
}

// 创建图片标记（显示所有图片，使用聚合）
function createImageMarkers() {
  if (!map) return;
  
  // 清除现有聚合组
  if (imageMarkerCluster) {
    map.removeLayer(imageMarkerCluster);
    imageMarkerCluster = null;
  }
  
  // 清除现有标记
  imageMarkers.forEach(marker => {
    if (map) {
      map.removeLayer(marker);
    }
  });
  imageMarkers = [];
  
  // 创建标记聚合组
  const clusterGroup = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 50, // 减小聚合半径，让标记更容易展开
    disableClusteringAtZoom: 12, // 在缩放级别 12 及以上时禁用聚合，直接显示所有标记
    spiderfyOnMaxZoom: false, // 禁用 spiderfy，直接显示标记
    showCoverageOnHover: false, // 悬停时不显示覆盖范围
    zoomToBoundsOnClick: true, // 点击聚合标记时缩放到边界
    removeOutsideVisibleBounds: true, // 移除视野外的标记以提升性能
    iconCreateFunction: function(cluster: L.MarkerCluster) {
      const count = cluster.getChildCount();
      let size = 'small';
      if (count > 100) {
        size = 'large';
      } else if (count > 10) {
        size = 'medium';
      }
      
      return L.divIcon({
        html: `<div style="
          background: rgba(13, 110, 253, 0.8);
          color: white;
          border-radius: 50%;
          width: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '30px'};
          height: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '30px'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: ${size === 'large' ? '14px' : size === 'medium' ? '12px' : '10px'};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${count}</div>`,
        className: 'marker-cluster',
        iconSize: L.point(size === 'large' ? 50 : size === 'medium' ? 40 : 30, size === 'large' ? 50 : size === 'medium' ? 40 : 30)
      });
    }
  });
  
  imageMarkerCluster = clusterGroup;
  
  // 为每张图片创建标记并添加到聚合组
  props.images.forEach((image) => {
    if (!image.location?.lat || !image.location?.lng) return;
    
    const marker = L.marker([image.location.lat, image.location.lng], {
      icon: createImageIcon(image.path, 50)
    });
    
    imageMarkers.push(marker);
    clusterGroup.addLayer(marker);
  });
  
  // 将聚合组添加到地图
  if (map) {
    clusterGroup.addTo(map);
  }
}

// 初始化地图
function initMap() {
  if (!mapContainer.value) return;
  
  // 设置地图初始中心点为上海，缩放级别以显示整个中国和日本
  // 上海坐标：纬度 31.2304，经度 121.4737
  // 为了同时显示中国和日本，需要合适的缩放级别（约 4-5）
  const center: [number, number] = [31.2304, 121.4737]; // 上海
  const zoom = 4; // 缩放级别 4 可以显示整个中国和日本
  
  map = L.map(mapContainer.value, {
    center,
    zoom,
    zoomControl: true,
    attributionControl: true
  });
  
  // 使用 OpenStreetMap 标准样式（彩色地图，显示地理颜色和名称）
  // OpenStreetMap 提供彩色地图，显示地形、道路、地名等信息
  currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0
  }).addTo(map);
  
  // 监听主题变化（保持相同的地图样式，OpenStreetMap 本身就是彩色的）
  watch(() => theme.GetThemeColor, (newTheme) => {
    // OpenStreetMap 是彩色地图，不需要根据主题切换
    // 如果需要暗色主题，可以在这里添加切换逻辑
  });
  
  // 创建标记
  createCountryMarkers();
  createImageMarkers();
  
  // 地图加载完成后调整视图
  if (map) {
    map.whenReady(() => {
      if (!map) return;
      
      // 如果有点位数据，优先使用点位数据调整视图
      if (countryMarkers.length > 0) {
        const group = new L.FeatureGroup(countryMarkers);
        const bounds = group.getBounds();
        // 扩展边界以确保能看到整个中国和日本
        const extendedBounds = L.latLngBounds(
          [bounds.getSouth() - 5, bounds.getWest() - 10], // 向南和向西扩展
          [bounds.getNorth() + 5, bounds.getEast() + 10]  // 向北和向东扩展
        );
        map.fitBounds(extendedBounds);
      } else {
        // 如果没有点位数据，使用预设的视图范围（中国和日本）
        // 设置边界：中国西部到日本东部，中国南部到中国北部
        const chinaJapanBounds = L.latLngBounds(
          [18.0, 100.0], // 西南角（中国南部，中国西部）
          [45.0, 145.0]  // 东北角（中国北部，日本东部）
        );
        map.fitBounds(chinaJapanBounds);
      }
    });
  }
}

// 监听数据变化
watch(() => props.images, () => {
  if (map) {
    createCountryMarkers();
    createImageMarkers();
  }
}, { deep: true });

watch(() => props.groupedImages, () => {
  if (map) {
    createCountryMarkers();
  }
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    initMap();
  });
});

onUnmounted(() => {
  if (imageMarkerCluster && map) {
    map.removeLayer(imageMarkerCluster);
    imageMarkerCluster = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
  countryMarkers = [];
  imageMarkers = [];
  currentTileLayer = null;
});
</script>

<style scoped>
.image-map-container {
  margin: 2rem auto;
  max-width: 1400px;
  padding: 0 1rem;
}

.map-container {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

:deep(.bg-dark) .map-container {
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

/* Leaflet 容器样式 */
:deep(.leaflet-container) {
  background: #f5f5f5;
  font-family: inherit;
}

:deep(.bg-dark .leaflet-container) {
  background: #1a1d21;
}

/* 图片标记样式 */
:deep(.image-marker-icon) {
  background: transparent !important;
  border: none !important;
}

:deep(.image-marker-icon) {
  z-index: 1000 !important;
}

:deep(.image-marker-icon img) {
  transition: transform 0.2s ease;
  pointer-events: none;
}

:deep(.image-marker-icon:hover img) {
  transform: scale(1.1);
  z-index: 1001;
}

/* 确保 Leaflet 标记容器有正确的 z-index */
:deep(.leaflet-marker-pane) {
  z-index: 600;
}

:deep(.leaflet-marker-icon) {
  z-index: 1000 !important;
}

/* 移除 Leaflet 默认标记样式 */
:deep(.leaflet-marker-icon) {
  border: none;
}

/* 标记聚合样式 */
:deep(.marker-cluster) {
  background: transparent !important;
  border: none !important;
}

:deep(.marker-cluster div) {
  transition: transform 0.2s ease;
}

:deep(.marker-cluster:hover div) {
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-container {
    height: 400px;
  }
}
</style>
