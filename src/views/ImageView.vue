<template>
  <div :class="'image-gallery-container ' + theme.GetBackgroundColorStyle">
    <!-- 地图组件 -->
    <ImageMap 
      :images="Images"
      :grouped-images="groupedByCountry"
      :gallery-ids="galleryIds"
    />
    
    <!-- 图片画廊组件 -->
    <HorizontalImageGallery
      v-for="(images, country) in groupedByCountry"
      :key="country"
      :images="images"
      :title="country"
      :title-class="'header-' + getCountryClassName(country)"
      :gallery-id="galleryIds[country]"
      @image-click="openFullscreen"
    >
      <!-- 樱花花瓣插槽（仅日本） -->
      <template v-if="getCountryClassName(country) === 'japan'" #header-extra>
        <span class="sakura-petal sakura-1"></span>
        <span class="sakura-petal sakura-2"></span>
        <span class="sakura-petal sakura-3"></span>
        <span class="sakura-petal sakura-4"></span>
        <span class="sakura-petal sakura-5"></span>
        <span class="sakura-petal sakura-6"></span>
      </template>
    </HorizontalImageGallery>

    <!-- 图片模态框 -->
    <div v-if="selectedImage" class="image-modal" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeImageModal" aria-label="关闭">
          <font-awesome-icon icon="fas fa-times" />
        </button>
        <img :src="CDN.getURL(selectedImage.path)" :alt="selectedImage.alt" />
        <div class="modal-info">
          <h3>{{ selectedImage.title }}</h3>
          <p v-if="selectedImage.desc">{{ selectedImage.desc }}</p>
        </div>
        <button 
          class="modal-nav modal-nav-prev" 
          @click="navigateImage(-1)"
          v-if="currentImageIndex > 0"
          aria-label="上一张"
        >
          <font-awesome-icon icon="fas fa-chevron-left" />
        </button>
        <button 
          class="modal-nav modal-nav-next" 
          @click="navigateImage(1)"
          v-if="currentImageIndex < currentImageList.length - 1"
          aria-label="下一张"
        >
          <font-awesome-icon icon="fas fa-chevron-right" />
        </button>
      </div>
    </div>

    <!-- 全屏查看模态框 -->
    <div v-if="fullscreenImage" class="fullscreen-modal" @click="closeFullscreen">
      <button class="fullscreen-close" @click="closeFullscreen" aria-label="关闭全屏">
        <font-awesome-icon icon="fas fa-times" />
      </button>
      <img 
        :src="CDN.getURL(fullscreenImage.path)" 
        :alt="fullscreenImage.alt"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCDNStore } from "@/stores/CDN";
import { useThemeStore } from "@/stores/Theme";
import { ref, computed } from "vue";
import HorizontalImageGallery from "@/components/image/HorizontalImageGallery.vue";
import ImageMap from "@/components/image/ImageMap.vue";
import type { ImageItem } from "@/types/image";

const CDN = useCDNStore();
const theme = useThemeStore();

// 扩展 ImageItem 类型以支持懒加载
interface ExtendedImageItem extends ImageItem {
  shouldLoad?: boolean;
}

const Images = ref<ExtendedImageItem[]>([
  {
    path: "/IMG/1.png",
    alt: "江之岛拍摄的富士山",
    title: "山-岛",
    desc: "江之岛拍摄的富士山",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
    location: {
      lat: 35.2971,
      lng: 139.4833,
      city: "江之岛",
      province: "神奈川县"
    }
  },
  {
    path: "/IMG/2.png",
    alt: "夜晚的七里滨",
    title: "夜之滨",
    desc: "夜晚的七里滨",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
    location: {
      lat: 35.3089,
      lng: 139.5203,
      city: "七里滨",
      province: "神奈川县"
    }
  },
  {
    path: "/IMG/3.png",
    alt: "清水寺",
    title: "清水寺",
    desc: "",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
    location: {
      lat: 34.9949,
      lng: 135.7850,
      city: "京都",
      province: "京都府"
    }
  },
  {
    path: "/IMG/4.png",
    alt: "京都",
    title: "京都-鸭川",
    desc: "",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
    location: {
      lat: 35.0116,
      lng: 135.7681,
      city: "京都",
      province: "京都府"
    }
  },
  {
    path: "/IMG/5.png",
    alt: "奈良公园",
    title: "奈良公园",
    desc: "",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
    location: {
      lat: 34.6851,
      lng: 135.8400,
      city: "奈良",
      province: "奈良县"
    }
  },
  {
    path: "/IMG/6.png",
    alt: "函馆山",
    title: "函馆山夜",
    desc: "夜晚的函馆",
    country: "日本",
    isLoading: false,
    shouldLoad: false,
    location: {
      lat: 41.7688,
      lng: 140.7289,
      city: "函馆",
      province: "北海道"
    }
  },
  {
    path: "/IMG/7.png",
    alt: "五棱郭",
    title: "五棱郭",
    desc: "",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
    location: {
      lat: 41.7970,
      lng: 140.7565,
      city: "函馆",
      province: "北海道"
    }
  },
  {
    path: "/IMG/8.png",
    alt: "五棱郭-樱花群",
    title: "樱花群",
    desc: "五棱郭",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
    location: {
      lat: 41.7970,
      lng: 140.7565,
      city: "函馆",
      province: "北海道"
    }
  },
]);

// 按国家分组
const groupedByCountry = computed(() => {
  const grouped: Record<string, ImageItem[]> = {};
  Images.value.forEach((image) => {
    if (!grouped[image.country]) {
      grouped[image.country] = [];
    }
    grouped[image.country].push(image);
  });
  return grouped;
});

// 生成每个国家对应的图片框 ID（用于地图跳转）
const galleryIds = computed(() => {
  const ids: Record<string, string> = {};
  Object.keys(groupedByCountry.value).forEach((country) => {
    // 使用国家名生成唯一 ID
    ids[country] = `gallery-${country}`;
  });
  return ids;
});

// 将中文国家名转换为英文类名
function getCountryClassName(country: string): string {
  const nameMap: Record<string, string> = {
    '日本': 'japan',
    '中国': 'china',
    '美国': 'usa',
    '法国': 'france',
    '意大利': 'italy',
  };
  return nameMap[country] || 'default';
}


// 图片模态框
const selectedImage = ref<ImageItem | null>(null);
const currentImageList = ref<ImageItem[]>([]);
const currentImageIndex = ref(0);

function openImageModal(image: ImageItem, images: ImageItem[]) {
  selectedImage.value = image;
  currentImageList.value = images;
  currentImageIndex.value = images.findIndex(img => img.path === image.path);
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  selectedImage.value = null;
  currentImageList.value = [];
  currentImageIndex.value = 0;
  document.body.style.overflow = '';
}

function navigateImage(direction: number) {
  const newIndex = currentImageIndex.value + direction;
  if (newIndex >= 0 && newIndex < currentImageList.value.length) {
    currentImageIndex.value = newIndex;
    selectedImage.value = currentImageList.value[newIndex];
  }
}

// 全屏查看
const fullscreenImage = ref<ImageItem | null>(null);

function openFullscreen(image: ImageItem) {
  fullscreenImage.value = image;
  document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
  fullscreenImage.value = null;
  document.body.style.overflow = '';
}

</script>

<style scoped>
.image-gallery-container {
  min-height: calc(100vh - 9.75rem);
}

.image-gallery-container.bg-light {
  background: #f5f5f5;
}

.image-gallery-container.bg-dark {
  background: #212529;
}

/* 日本风格 - 樱花粉渐变 + 樱花飘落动画 */
.header-japan {
  background: linear-gradient(135deg, #ff6b9d 0%, #ffb3d1 50%, #ffd6e8 100%);
  position: relative;
  overflow: hidden;
}

/* 樱花花瓣样式 */
.sakura-petal {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50% 0 50% 0;
  pointer-events: none;
  z-index: 1;
  top: -20px;
}

/* 每个花瓣的不同位置和动画 */
.sakura-1 {
  left: 10%;
  animation: sakura-fall-1 8s infinite linear;
}

.sakura-2 {
  left: 25%;
  animation: sakura-fall-2 10s infinite linear;
  animation-delay: 1s;
}

.sakura-3 {
  left: 40%;
  animation: sakura-fall-3 9s infinite linear;
  animation-delay: 2s;
}

.sakura-4 {
  left: 55%;
  animation: sakura-fall-1 11s infinite linear;
  animation-delay: 0.5s;
}

.sakura-5 {
  left: 70%;
  animation: sakura-fall-2 9.5s infinite linear;
  animation-delay: 1.5s;
}

.sakura-6 {
  left: 85%;
  animation: sakura-fall-3 10.5s infinite linear;
  animation-delay: 2.5s;
}

/* 樱花飘落动画 - 使用伪元素创建多个花瓣（旧代码，将被新代码覆盖） */
.header-japan::before,
.header-japan::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50% 0 50% 0;
  pointer-events: none;
  z-index: 1;
}

.header-japan::before {
  left: 10%;
  top: -20px;
  animation: sakura-fall-1 8s infinite linear;
  box-shadow: 
    200px 0 0 rgba(255, 255, 255, 0.7),
    400px 0 0 rgba(255, 255, 255, 0.6),
    600px 0 0 rgba(255, 255, 255, 0.8),
    800px 0 0 rgba(255, 255, 255, 0.7);
}

.header-japan::after {
  left: 20%;
  top: -20px;
  animation: sakura-fall-2 10s infinite linear;
  animation-delay: 1s;
  box-shadow: 
    150px 0 0 rgba(255, 255, 255, 0.6),
    350px 0 0 rgba(255, 255, 255, 0.7),
    550px 0 0 rgba(255, 255, 255, 0.5),
    750px 0 0 rgba(255, 255, 255, 0.6);
}

/* 使用标题的伪元素创建更多花瓣 */
.header-japan .section-title::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50% 0 50% 0;
  left: -50px;
  top: -20px;
  pointer-events: none;
  z-index: 1;
  animation: sakura-fall-3 12s infinite linear;
  animation-delay: 2s;
  box-shadow: 
    100px 0 0 rgba(255, 255, 255, 0.5),
    250px 0 0 rgba(255, 255, 255, 0.6),
    450px 0 0 rgba(255, 255, 255, 0.7),
    650px 0 0 rgba(255, 255, 255, 0.5);
}

/* 樱花飘落动画 - 不同的路径和速度 */
@keyframes sakura-fall-1 {
  0% {
    transform: translateY(-50px) translateX(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(150px) translateX(30px) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(300px) translateX(-20px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes sakura-fall-2 {
  0% {
    transform: translateY(-50px) translateX(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(180px) translateX(-40px) rotate(180deg);
    opacity: 0.7;
  }
  100% {
    transform: translateY(350px) translateX(50px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes sakura-fall-3 {
  0% {
    transform: translateY(-50px) translateX(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(200px) translateX(25px) rotate(180deg);
    opacity: 0.6;
  }
  100% {
    transform: translateY(400px) translateX(-35px) rotate(360deg);
    opacity: 0;
  }
}

/* 中国风格 - 红色渐变 */
.header-china {
  background: linear-gradient(135deg, #c8102e 0%, #dc143c 50%, #ff1744 100%);
  background-image: 
    radial-gradient(circle at 30% 40%, rgba(255, 215, 0, 0.2) 0%, transparent 40%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 8px,
      rgba(255,255,255,0.1) 8px,
      rgba(255,255,255,0.1) 16px
    );
}

/* 美国风格 - 蓝白条纹 */
.header-usa {
  background: linear-gradient(135deg, #002868 0%, #0033a0 50%, #1e3a8a 100%);
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 4px,
      rgba(255,255,255,0.1) 4px,
      rgba(255,255,255,0.1) 8px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 8px,
      rgba(255,255,255,0.08) 8px,
      rgba(255,255,255,0.08) 16px
    );
}

/* 法国风格 - 蓝白红三色 */
.header-france {
  background: linear-gradient(135deg, #002654 0%, #0055a4 33%, #ffffff 33%, #ffffff 66%, #ef4135 66%, #ed2939 100%);
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0,0,0,0.05) 10px,
      rgba(0,0,0,0.05) 20px
    );
}

/* 意大利风格 - 绿白红三色 */
.header-italy {
  background: linear-gradient(135deg, #009246 0%, #ffffff 33%, #ffffff 66%, #ce2b37 66%, #ce2b37 100%);
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0,0,0,0.05) 10px,
      rgba(0,0,0,0.05) 20px
    );
}

/* 默认风格 */
.header-default {
  background: linear-gradient(135deg, #6c757d 0%, #495057 50%, #343a40 100%);
}


/* 图片模态框 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-info {
  margin-top: 1rem;
  text-align: center;
  color: white;
}

.modal-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.modal-info p {
  margin: 0.25rem 0;
  opacity: 0.9;
}


.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal-nav svg {
  font-size: 1.5rem;
}

.modal-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.modal-nav-prev {
  left: -60px;
}

.modal-nav-next {
  right: -60px;
}

/* 全屏查看模态框 */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.fullscreen-modal img {
  max-width: 100vw;
  max-height: 100vh;
  width: auto;
  height: auto;
  object-fit: contain;
}

.fullscreen-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10001;
}

.fullscreen-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.fullscreen-close svg {
  font-size: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-gallery-container {
    padding: 1rem 0.5rem;
  }

  .gallery-content {
    padding: 1rem;
  }

  .gallery-item {
    width: 280px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
  }

  .nav-btn-left {
    left: -18px;
    transform: translate(-50%, -50%);
  }

  .nav-btn-right {
    right: -18px;
    transform: translate(50%, -50%);
  }

  .scroll-fade {
    width: 40px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .modal-nav-prev {
    left: 10px;
  }

  .modal-nav-next {
    right: 10px;
  }

  .modal-close {
    top: 10px;
    right: 10px;
  }
}
</style>
