<template>
  <div class="gallery-section" :id="galleryId">
    <!-- 标题栏 -->
    <div :class="'section-header ' + titleClass">
      <h1 class="section-title">{{ title }}</h1>
      <slot name="header-extra"></slot>
    </div>
    
    <!-- 内容区域 -->
    <div :class="'gallery-content gallery-content-' + theme.GetThemeColor">
      <div 
        class="gallery-scroll-wrapper"
      >
        <!-- 左侧渐变遮罩 -->
        <div 
          class="scroll-fade scroll-fade-left"
          :class="{ 'fade-hidden': scrollState.isAtStart, 'scroll-fade-dark': theme.GetThemeColor === 'dark' }"
        ></div>
        
        <div 
          class="gallery-scroll" 
          ref="scrollElementRef"
          @scroll="handleScroll"
        >
          <div 
            class="gallery-item" 
            v-for="(item, index) in images" 
            :key="'image-' + galleryId + '-' + index"
            @click="handleImageClick(item)"
          >
            <div class="thumbnail-wrapper">
              <Loading v-if="item.isLoading" class="thumbnail-loading" />
              <img 
                :style="{ display: item.isLoading ? 'none' : 'block' }"
                @load="handleImageLoad(item, index)"
                @error="handleImageError(item, index)"
                :src="item.shouldLoad ? CDN.getURL(item.path) : ''" 
                :data-src="CDN.getURL(item.path)"
                :alt="item.alt"
                :ref="el => setImageRef(item, el as HTMLImageElement | null)"
              />
              <div class="thumbnail-overlay">
                <div class="thumbnail-info">
                  <h5>{{ item.title }}</h5>
                  <p v-if="item.desc">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧渐变遮罩 -->
        <div 
          class="scroll-fade scroll-fade-right"
          :class="{ 'fade-hidden': scrollState.isAtEnd, 'scroll-fade-dark': theme.GetThemeColor === 'dark' }"
        ></div>
      </div>
      
      <!-- 左侧导航按钮 -->
      <button 
        class="nav-btn nav-btn-left"
        :class="{ 'btn-hidden': scrollState.isAtStart }"
        @click="scrollLeft"
        :aria-label="'向左滚动 ' + title + ' 的图片'"
      >
        <font-awesome-icon icon="fas fa-chevron-left" />
      </button>
      
      <!-- 右侧导航按钮 -->
      <button 
        class="nav-btn nav-btn-right"
        :class="{ 'btn-hidden': scrollState.isAtEnd }"
        @click="scrollRight"
        :aria-label="'向右滚动 ' + title + ' 的图片'"
      >
        <font-awesome-icon icon="fas fa-chevron-right" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useCDNStore } from "@/stores/CDN";
import { useThemeStore } from "@/stores/Theme";
import Loading from "@/components/common/Loading.vue";
import type { ImageItem } from "@/types/image";

interface ExtendedImageItem extends ImageItem {
  shouldLoad?: boolean;
}

const props = defineProps<{
  images: ImageItem[];
  title: string;
  titleClass?: string;
  galleryId: string;
}>();

const emit = defineEmits<{
  (e: 'image-click', image: ImageItem): void;
}>();

const CDN = useCDNStore();
const theme = useThemeStore();

// 滚动相关
const scrollElementRef = ref<HTMLElement | null>(null);
const scrollState = ref<{ isAtStart: boolean; isAtEnd: boolean }>({ isAtStart: true, isAtEnd: false });
const scrollTimer = ref<number | undefined>(undefined);
const scrollButtonTimer = ref<number | undefined>(undefined);
const isInitialized = ref(false);

// 图片相关
const imageRefs = ref<Map<ImageItem, HTMLImageElement>>(new Map());
let imageObserver: IntersectionObserver | null = null;

// 检查滚动位置
function checkScrollPosition() {
  const element = scrollElementRef.value;
  if (!element || !element.parentNode) {
    return;
  }
  
  const scrollLeft = element.scrollLeft;
  const scrollWidth = element.scrollWidth;
  const clientWidth = element.clientWidth;
  const threshold = 5;

  const isAtStart = scrollLeft <= threshold;
  const isAtEnd = scrollLeft + clientWidth >= scrollWidth - threshold;

  if (scrollState.value.isAtStart !== isAtStart || scrollState.value.isAtEnd !== isAtEnd) {
    scrollState.value = { isAtStart, isAtEnd };
  }
}

// 处理滚动事件
function handleScroll() {
  const element = scrollElementRef.value;
  if (!element) return;
  
  if (scrollTimer.value !== undefined) {
    clearTimeout(scrollTimer.value);
  }
  
  checkScrollPosition();
  scrollTimer.value = window.setTimeout(() => {
    checkScrollPosition();
    scrollTimer.value = undefined;
  }, 100);
}

// 滚动控制
function scrollLeft() {
  const element = scrollElementRef.value;
  if (!element) return;
  
  if (scrollButtonTimer.value !== undefined) {
    clearTimeout(scrollButtonTimer.value);
  }
  
  element.scrollBy({ left: -400, behavior: 'smooth' });
  requestAnimationFrame(() => {
    scrollButtonTimer.value = window.setTimeout(() => {
      checkScrollPosition();
      scrollButtonTimer.value = undefined;
    }, 400);
  });
}

function scrollRight() {
  const element = scrollElementRef.value;
  if (!element) return;
  
  if (scrollButtonTimer.value !== undefined) {
    clearTimeout(scrollButtonTimer.value);
  }
  
  element.scrollBy({ left: 400, behavior: 'smooth' });
  requestAnimationFrame(() => {
    scrollButtonTimer.value = window.setTimeout(() => {
      checkScrollPosition();
      scrollButtonTimer.value = undefined;
    }, 400);
  });
}

// 设置图片元素引用
function setImageRef(item: ImageItem, el: HTMLImageElement | null) {
  if (el) {
    imageRefs.value.set(item, el);
    
    // 如果图片已经标记为 shouldLoad，立即设置 src 并强制加载
    if ((item as ExtendedImageItem).shouldLoad) {
      const imageUrl = CDN.getURL(item.path);
      // 强制设置 src，确保浏览器发起请求
      el.src = imageUrl;
      // 如果图片已经加载完成，立即触发 load 事件处理
      if (el.complete && el.naturalWidth > 0) {
        handleImageLoad(item, 0);
      }
    }
    
    // 如果 Observer 已初始化，立即 observe
    if (imageObserver && !(item as ExtendedImageItem).shouldLoad) {
      imageObserver.observe(el);
    }
  } else {
    const img = imageRefs.value.get(item);
    if (img && imageObserver) {
      imageObserver.unobserve(img);
    }
    imageRefs.value.delete(item);
  }
}

// 初始化 Intersection Observer
function initImageObserver() {
  if (typeof IntersectionObserver === 'undefined') {
    props.images.forEach(item => {
      (item as ExtendedImageItem).shouldLoad = true;
    });
    return;
  }

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          for (const [item, imgElement] of imageRefs.value.entries()) {
            if (imgElement === img) {
              if (!(item as ExtendedImageItem).shouldLoad) {
                (item as ExtendedImageItem).shouldLoad = true;
                // 立即设置 src 触发加载
                const imageUrl = CDN.getURL(item.path);
                if (img.src !== imageUrl) {
                  img.src = imageUrl;
                }
              }
              imageObserver?.unobserve(img);
              break;
            }
          }
        }
      });
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0.01,
    }
  );

  // 在 nextTick 中 observe 所有未加载的图片
  nextTick(() => {
    imageRefs.value.forEach((img, item) => {
      if (img && !(item as ExtendedImageItem).shouldLoad) {
        imageObserver?.observe(img);
      }
    });
  });
}

// 图片加载处理
function handleImageLoad(item: ImageItem, index: number) {
  (item as ExtendedImageItem).isLoading = false;
}

function handleImageError(item: ImageItem, index: number) {
  (item as ExtendedImageItem).isLoading = false;
  console.error(`图片加载失败: ${CDN.getURL(item.path)}`);
}

// 确保图片开始加载
function ensureImageLoads(item: ImageItem) {
  if ((item as ExtendedImageItem).shouldLoad) {
    const img = imageRefs.value.get(item);
    if (img && !img.src) {
      img.src = CDN.getURL(item.path);
    }
  }
}

// 图片点击
function handleImageClick(image: ImageItem) {
  emit('image-click', image);
}

// 初始化滚动状态
function initScrollState() {
  if (!isInitialized.value && scrollElementRef.value) {
    isInitialized.value = true;
    scrollState.value = { isAtStart: true, isAtEnd: false };
    nextTick(() => {
      if (scrollElementRef.value && scrollElementRef.value.parentNode) {
        checkScrollPosition();
      }
    });
  }
}

// 监听 images 变化，重新初始化
watch(() => props.images, () => {
  nextTick(() => {
    initScrollState();
    initImageObserver();
  });
}, { deep: true });

onMounted(() => {
  initScrollState();
  
  // 立即加载前几张图片（通常是可见的）
  const visibleCount = Math.min(4, props.images.length);
  props.images.slice(0, visibleCount).forEach((item) => {
    (item as ExtendedImageItem).shouldLoad = true;
  });
  
  // 初始化 Observer
  initImageObserver();
  
  // 等待所有图片元素都被设置引用，然后强制设置 src
  nextTick(() => {
    nextTick(() => {
      // 确保已标记为 shouldLoad 的图片立即开始加载
      props.images.slice(0, visibleCount).forEach((item) => {
        const img = imageRefs.value.get(item);
        if (img) {
          const imageUrl = CDN.getURL(item.path);
          // 强制设置 src，即使已经设置过也要重新设置以确保加载
          img.src = imageUrl;
          // 如果图片已经加载完成，立即触发 load 事件处理
          if (img.complete && img.naturalWidth > 0) {
            handleImageLoad(item, 0);
          }
        }
      });
      
      // 确保所有未加载的图片都被 observe
      imageRefs.value.forEach((img, item) => {
        if (img && !(item as ExtendedImageItem).shouldLoad && imageObserver) {
          imageObserver.observe(img);
        }
      });
    });
  });
});

onUnmounted(() => {
  if (scrollTimer.value !== undefined) {
    clearTimeout(scrollTimer.value);
  }
  if (scrollButtonTimer.value !== undefined) {
    clearTimeout(scrollButtonTimer.value);
  }
  if (imageObserver) {
    imageRefs.value.forEach((img) => {
      imageObserver?.unobserve(img);
    });
    imageObserver.disconnect();
    imageObserver = null;
  }
  imageRefs.value.clear();
});
</script>

<style scoped>
.gallery-section {
  margin-bottom: 3rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  overflow: visible;
  position: relative;
  transition: box-shadow 0.3s ease;
  padding-right: 32px;
  padding-left: 32px;
}

/* 标题栏 */
.section-header {
  position: relative;
  padding: 1rem 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: 0;
  box-shadow: 
    0 -2px 8px rgba(0,0,0,0.1),
    -2px 0 8px rgba(0,0,0,0.1),
    2px 0 8px rgba(0,0,0,0.1);
}

:deep(.bg-dark) .section-header {
  box-shadow: 
    0 -2px 8px rgba(0,0,0,0.3),
    -2px 0 8px rgba(0,0,0,0.3),
    2px 0 8px rgba(0,0,0,0.3);
}

/* 国家标题样式 */
.header-japan {
  background: linear-gradient(135deg, #ff6b9d 0%, #ffb3d1 50%, #ffd6e8 100%);
  position: relative;
  overflow: hidden;
}

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

.header-default {
  background: linear-gradient(135deg, #6c757d 0%, #495057 50%, #343a40 100%);
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

/* 樱花飘落动画 */
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

.section-title {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  position: relative;
  z-index: 2;
}

/* 内容区域 */
.gallery-content {
  position: relative;
  border-radius: 0 0 12px 12px;
  padding: 1.5rem;
  margin-top: 0;
  box-shadow: 
    0 2px 8px rgba(0,0,0,0.1),
    -2px 0 8px rgba(0,0,0,0.1),
    2px 0 8px rgba(0,0,0,0.1);
}

.gallery-content-light {
  background: #fafafa;
}

.gallery-content-dark {
  background: #2d333b;
  box-shadow: 
    0 2px 8px rgba(0,0,0,0.3),
    -2px 0 8px rgba(0,0,0,0.3),
    2px 0 8px rgba(0,0,0,0.3);
}

.gallery-scroll-wrapper {
  position: relative;
  width: 100%;
}

.gallery-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.5rem 0;
}

.gallery-scroll::-webkit-scrollbar {
  display: none;
}

/* 渐变遮罩 */
.scroll-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  pointer-events: none;
  z-index: 1;
}

.scroll-fade-left {
  left: 0;
  background: linear-gradient(to right, #fafafa, transparent);
}

.scroll-fade-right {
  right: 0;
  background: linear-gradient(to left, #fafafa, transparent);
}

.scroll-fade-left.scroll-fade-dark {
  background: linear-gradient(to right, #2d333b, transparent);
}

.scroll-fade-right.scroll-fade-dark {
  background: linear-gradient(to left, #2d333b, transparent);
}

.scroll-fade.fade-hidden {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item {
  flex-shrink: 0;
  width: 380px;
  cursor: pointer;
}

.thumbnail-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: #f0f0f0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

:deep(.bg-dark) .thumbnail-wrapper {
  background: #1a1d21;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.thumbnail-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnail-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.thumbnail-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.gallery-item:hover .thumbnail-overlay {
  opacity: 1;
}

.thumbnail-info {
  color: white;
}

.thumbnail-info h5 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: bold;
}

.thumbnail-info p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

/* 导航按钮 */
.nav-btn {
  position: absolute;
  top: 50%;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e9ecef;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.nav-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

:deep(.bg-dark) .nav-btn {
  background: #2d333b;
  border-color: #495057;
  color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

:deep(.bg-dark) .nav-btn:hover {
  background: #3d4349;
}

.nav-btn-left {
  left: 0;
  transform: translate(-50%, -50%);
}

.nav-btn-right {
  right: 0;
  transform: translate(50%, -50%);
}

/* 确保导航按钮不被遮挡 */
.gallery-scroll-wrapper {
  overflow: visible;
}

.gallery-content {
  position: relative;
  overflow: visible;
}

.nav-btn.btn-hidden {
  opacity: 0;
  pointer-events: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gallery-item {
    width: 280px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
  }

  .nav-btn-left {
    left: 0;
    transform: translate(-50%, -50%);
  }

  .nav-btn-right {
    right: 0;
    transform: translate(50%, -50%);
  }

  .scroll-fade {
    width: 40px;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
