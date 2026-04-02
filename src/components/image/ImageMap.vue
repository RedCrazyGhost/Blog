<template>
  <div class="image-map-container" :class="theme.GetBackgroundColorStyle">
    <div class="map-wrapper">
      <div ref="mapContainer" class="map-container"></div>
      <button
        type="button"
        class="map-reset-btn"
        aria-label="重置到初始视图"
        title="重置到初始视图"
        @click="resetToInitialView"
      >
        <font-awesome-icon icon="fas fa-map-location-dot" />
      </button>
    </div>
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
import "leaflet.markercluster";

const props = defineProps<{
  images: ImageItem[];
  groupedImages: Record<string, ImageItem[]>;
  galleryIds: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "marker-click", image: ImageItem): void;
}>();

const theme = useThemeStore();
const CDN = useCDNStore();
const mapContainer = ref<HTMLElement | null>(null);

let map: L.Map | null = null;
let imageMarkers: L.Marker[] = [];
let imageMarkerCluster: L.MarkerClusterGroup | null = null;

// 创建图片图标（含加载失败时的占位，安全处理 parentElement）
function createImageIcon(imagePath: string, size: number = 60): L.DivIcon {
  const imageUrl = CDN.getURL(imagePath);
  const fallbackHtml = `<div style="width:${size}px;height:${size}px;background:#dc3545;border-radius:8px;border:3px solid white;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;">图片</div>`;
  const fallbackEscaped = fallbackHtml
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "&#39;")
    .replace(/"/g, "&quot;");
  return L.divIcon({
    className: "image-marker-icon",
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
        onerror="this.onerror=null;var p=this.parentElement;if(p)p.innerHTML='${fallbackEscaped}';"
      />
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// 创建图片标记（显示所有图片，使用聚合）
function createImageMarkers() {
  if (!map) return;

  // 清除现有聚合组（会一并移除其下所有 marker）
  if (imageMarkerCluster) {
    map.removeLayer(imageMarkerCluster);
    imageMarkerCluster = null;
  }
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
    iconCreateFunction: function (cluster: L.MarkerCluster) {
      const count = cluster.getChildCount();
      let size = "small";
      if (count > 100) {
        size = "large";
      } else if (count > 10) {
        size = "medium";
      }

      return L.divIcon({
        html: `<div style="
          background: rgba(13, 110, 253, 0.8);
          color: white;
          border-radius: 50%;
          width: ${
            size === "large" ? "50px" : size === "medium" ? "40px" : "30px"
          };
          height: ${
            size === "large" ? "50px" : size === "medium" ? "40px" : "30px"
          };
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: ${
            size === "large" ? "14px" : size === "medium" ? "12px" : "10px"
          };
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${count}</div>`,
        className: "marker-cluster",
        iconSize: L.point(
          size === "large" ? 50 : size === "medium" ? 40 : 30,
          size === "large" ? 50 : size === "medium" ? 40 : 30,
        ),
      });
    },
  });

  imageMarkerCluster = clusterGroup;

  // 为每张图片创建标记并添加到聚合组
  props.images.forEach((image) => {
    if (!image.location?.lat || !image.location?.lng) return;

    const marker = L.marker([image.location.lat, image.location.lng], {
      icon: createImageIcon(image.path, 50),
    });
    marker.on("click", () => emit("marker-click", image));

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
    attributionControl: true,
  });

  // 使用 OpenStreetMap 标准样式（彩色地图，显示地理颜色和名称）
  // OpenStreetMap 提供彩色地图，显示地形、道路、地名等信息
  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0,
    },
  ).addTo(map);

  // 创建标记
  createImageMarkers();

  // 地图加载完成后调整视图
  if (map) {
    map.whenReady(() => {
      if (!map) return;
      const chinaJapanBounds = L.latLngBounds([18.0, 100.0], [45.0, 145.0]);
      if (imageMarkerCluster) {
        const bounds = imageMarkerCluster.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
        } else {
          map.fitBounds(chinaJapanBounds);
        }
      } else {
        map.fitBounds(chinaJapanBounds);
      }
    });
  }
}

const chinaJapanBounds = L.latLngBounds([18.0, 100.0], [45.0, 145.0]);

function resetToInitialView() {
  if (!map) return;
  if (imageMarkerCluster) {
    const bounds = imageMarkerCluster.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    } else {
      map.fitBounds(chinaJapanBounds);
    }
  } else {
    map.fitBounds(chinaJapanBounds);
  }
}

// 监听数据变化
watch(
  () => props.images,
  () => {
    if (map) {
      createImageMarkers();
    }
  },
  { deep: true },
);

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
  imageMarkers = [];
});
</script>

<style scoped>
.image-map-container {
  margin: 2rem auto;
  max-width: 1400px;
  padding: 0 1rem;
}

.map-wrapper {
  position: relative;
}

.map-container {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.map-reset-btn {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 1.25rem;
  color: #333;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition:
    background 0.2s,
    box-shadow 0.2s;
}

.map-reset-btn:hover {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

:deep(.bg-dark) .map-reset-btn {
  color: #e9ecef;
  background: rgba(42, 44, 48, 0.95);
  border-color: rgba(255, 255, 255, 0.15);
}

:deep(.bg-dark) .map-reset-btn:hover {
  background: rgba(55, 58, 63, 0.98);
}

:deep(.bg-dark) .map-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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
