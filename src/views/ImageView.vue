<template>
  <div :class="'image-gallery-container ' + theme.GetBackgroundColorStyle">
    <div v-for="(images, country) in groupedByCountry" :key="country" class="gallery-section">
      <!-- 标题栏 -->
      <div :class="'section-header header-' + getCountryClassName(country)">
        <h1 class="section-title">{{ country }}</h1>
        <!-- 樱花花瓣（仅日本） -->
        <template v-if="getCountryClassName(country) === 'japan'">
          <span class="sakura-petal sakura-1"></span>
          <span class="sakura-petal sakura-2"></span>
          <span class="sakura-petal sakura-3"></span>
          <span class="sakura-petal sakura-4"></span>
          <span class="sakura-petal sakura-5"></span>
          <span class="sakura-petal sakura-6"></span>
        </template>
      </div>
      
      <!-- 内容区域 -->
      <div :class="'gallery-content gallery-content-' + theme.GetThemeColor">
        <div 
          class="gallery-scroll-wrapper"
          :ref="el => setScrollRef(country, el as HTMLElement | null)"
        >
          <!-- 左侧渐变遮罩 -->
          <div 
            class="scroll-fade scroll-fade-left"
            :class="{ 'fade-hidden': getScrollState(country).isAtStart, 'scroll-fade-dark': theme.GetThemeColor === 'dark' }"
          ></div>
          
          <div 
            class="gallery-scroll" 
            @scroll="handleScroll(country)"
          >
            <div 
              class="gallery-item" 
              v-for="(item, index) in images" 
              :key="'image-' + country + '-' + index"
              @click="openFullscreen(item)"
            >
              <div class="thumbnail-wrapper">
                <Loading v-if="item.isLoading" class="thumbnail-loading" />
                <img 
                  v-show="!item.isLoading"
                  @load="LoadingDone(item, index, country)"
                  @error="LoadingError(item, index, country)"
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
            :class="{ 'fade-hidden': getScrollState(country).isAtEnd, 'scroll-fade-dark': theme.GetThemeColor === 'dark' }"
          ></div>
          
          <!-- 左侧导航按钮 -->
          <button 
            class="nav-btn nav-btn-left"
            :class="{ 'btn-hidden': getScrollState(country).isAtStart }"
            @click="scrollLeft(country)"
            :aria-label="'向左滚动 ' + country + ' 的图片'"
          >
            <font-awesome-icon icon="fas fa-chevron-left" />
          </button>
          
          <!-- 右侧导航按钮 -->
          <button 
            class="nav-btn nav-btn-right"
            :class="{ 'btn-hidden': getScrollState(country).isAtEnd }"
            @click="scrollRight(country)"
            :aria-label="'向右滚动 ' + country + ' 的图片'"
          >
            <font-awesome-icon icon="fas fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>

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
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import Loading from "@/components/common/Loading.vue";
import type { ImageItem } from "@/types/image";

const CDN = useCDNStore();
const theme = useThemeStore();

// 扩展 ImageItem 类型以支持懒加载
interface ExtendedImageItem extends ImageItem {
  shouldLoad?: boolean;
}

// 图片元素引用映射
const imageRefs = ref<Map<ImageItem, HTMLImageElement>>(new Map());
// Intersection Observer 实例
let imageObserver: IntersectionObserver | null = null;

const Images = ref<ExtendedImageItem[]>([
  {
    path: "/IMG/1.png",
    alt: "江之岛拍摄的富士山",
    title: "山-岛",
    desc: "江之岛拍摄的富士山",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
  },
  {
    path: "/IMG/2.png",
    alt: "夜晚的七里滨",
    title: "夜之滨",
    desc: "夜晚的七里滨",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
  },
  {
    path: "/IMG/3.png",
    alt: "清水寺",
    title: "清水寺",
    desc: "",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
  },
  {
    path: "/IMG/4.png",
    alt: "京都",
    title: "京都-鸭川",
    desc: "",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
  },
  {
    path: "/IMG/5.png",
    alt: "奈良公园",
    title: "奈良公园",
    desc: "",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
  },
  {
    path: "/IMG/6.png",
    alt: "函馆山",
    title: "函馆山夜",
    desc: "夜晚的函馆",
    country: "日本",
    isLoading: false,
    shouldLoad: false,
  },
  {
    path: "/IMG/7.png",
    alt: "五棱郭",
    title: "五棱郭",
    desc: "",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
  },
  {
    path: "/IMG/8.png",
    alt: "五棱郭-樱花群",
    title: "樱花群",
    desc: "五棱郭",
    country: "日本",
    isLoading: true,
    shouldLoad: false,
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

// 滚动容器引用
const scrollRefs = ref<Record<string, HTMLElement | null>>({});
// 滚动状态
const scrollStates = ref<Record<string, { isAtStart: boolean; isAtEnd: boolean }>>({});
// 滚动防抖定时器
const scrollTimers = ref<Record<string, number | undefined>>({});
// 滚动按钮的定时器
const scrollButtonTimers = ref<Record<string, number | undefined>>({});
// 记录已初始化的国家，避免重复初始化
const initializedCountries = ref<Set<string>>(new Set());

function setScrollRef(country: string, el: HTMLElement | null) {
  if (el) {
    // 查找内部的 gallery-scroll 元素作为实际滚动容器
    const scrollElement = (el as HTMLElement).querySelector('.gallery-scroll') as HTMLElement;
    if (scrollElement) {
      // 避免重复设置相同的滚动元素
      if (scrollRefs.value[country] === scrollElement) {
        return;
      }
      
      scrollRefs.value[country] = scrollElement;
      
      // 只在首次初始化时设置状态和检查位置
      if (!initializedCountries.value.has(country)) {
        initializedCountries.value.add(country);
        // 初始化滚动状态
        scrollStates.value[country] = { isAtStart: true, isAtEnd: false };
        
        // 初始检查滚动位置（延迟执行，避免在渲染过程中触发更新）
        nextTick(() => {
          // 再次检查元素是否仍然存在，避免在卸载后执行
          if (scrollRefs.value[country] === scrollElement && scrollElement.parentNode) {
            checkScrollPosition(country, scrollElement);
          }
        });
      }
    } else {
      // 如果找不到，使用 wrapper 本身
      if (scrollRefs.value[country] !== el) {
        scrollRefs.value[country] = el as HTMLElement;
      }
    }
  } else {
    // 元素被卸载时清理引用
    if (scrollRefs.value[country]) {
      initializedCountries.value.delete(country);
      delete scrollRefs.value[country];
    }
  }
}

// 检查滚动位置
function checkScrollPosition(country: string, element: HTMLElement) {
  // 检查元素是否仍然有效
  if (!element || !element.parentNode) {
    return;
  }
  
  const scrollLeft = element.scrollLeft;
  const scrollWidth = element.scrollWidth;
  const clientWidth = element.clientWidth;
  const threshold = 5; // 容差，避免浮点数精度问题

  const isAtStart = scrollLeft <= threshold;
  const isAtEnd = scrollLeft + clientWidth >= scrollWidth - threshold;

  // 只有在状态真正改变时才更新，避免不必要的响应式更新
  const currentState = scrollStates.value[country];
  if (!currentState || currentState.isAtStart !== isAtStart || currentState.isAtEnd !== isAtEnd) {
    scrollStates.value[country] = { isAtStart, isAtEnd };
  }
}

// 处理滚动事件（使用防抖优化性能）
function handleScroll(country: string) {
  const scrollElement = scrollRefs.value[country];
  if (scrollElement) {
    // 清除之前的定时器
    if (scrollTimers.value[country]) {
      clearTimeout(scrollTimers.value[country]);
    }
    // 立即检查一次（用于快速响应）
    checkScrollPosition(country, scrollElement);
    // 设置防抖定时器，滚动结束后再检查一次（确保准确）
    scrollTimers.value[country] = window.setTimeout(() => {
      checkScrollPosition(country, scrollElement);
      scrollTimers.value[country] = undefined;
    }, 100);
  }
}

// 获取滚动状态
function getScrollState(country: string) {
  return scrollStates.value[country] || { isAtStart: true, isAtEnd: false };
}

// 滚动控制
function scrollLeft(country: string) {
  const scrollRef = scrollRefs.value[country];
  if (scrollRef) {
    // 清除之前的定时器
    if (scrollButtonTimers.value[country]) {
      clearTimeout(scrollButtonTimers.value[country]);
    }
    
    scrollRef.scrollBy({ left: -400, behavior: 'smooth' });
    // 平滑滚动完成后检查位置（使用 requestAnimationFrame 确保更准确）
    requestAnimationFrame(() => {
      scrollButtonTimers.value[country] = window.setTimeout(() => {
        checkScrollPosition(country, scrollRef);
        scrollButtonTimers.value[country] = undefined;
      }, 400);
    });
  }
}

function scrollRight(country: string) {
  const scrollRef = scrollRefs.value[country];
  if (scrollRef) {
    // 清除之前的定时器
    if (scrollButtonTimers.value[country]) {
      clearTimeout(scrollButtonTimers.value[country]);
    }
    
    scrollRef.scrollBy({ left: 400, behavior: 'smooth' });
    // 平滑滚动完成后检查位置（使用 requestAnimationFrame 确保更准确）
    requestAnimationFrame(() => {
      scrollButtonTimers.value[country] = window.setTimeout(() => {
        checkScrollPosition(country, scrollRef);
        scrollButtonTimers.value[country] = undefined;
      }, 400);
    });
  }
}

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

// 设置图片元素引用
function setImageRef(item: ExtendedImageItem, el: HTMLImageElement | null) {
  if (el) {
    imageRefs.value.set(item, el);
    // 如果 Observer 已创建，立即观察这个元素
    if (imageObserver) {
      imageObserver.observe(el);
    }
  } else {
    // 元素被移除时，取消观察
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
    // 浏览器不支持 Intersection Observer，直接加载所有图片
    Images.value.forEach(item => {
      item.shouldLoad = true;
    });
    return;
  }

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // 找到对应的图片项
          for (const [item, imgElement] of imageRefs.value.entries()) {
            if (imgElement === img) {
              if (!item.shouldLoad) {
                // 设置 shouldLoad 为 true，Vue 会自动更新 src 属性
                item.shouldLoad = true;
              }
              // 图片开始加载后，取消观察
              imageObserver?.unobserve(img);
              break;
            }
          }
        }
      });
    },
    {
      root: null, // 使用视口作为根
      rootMargin: '50px', // 提前 50px 开始加载
      threshold: 0.01, // 只要有一点可见就触发
    }
  );

  // 观察所有已存在的图片元素
  nextTick(() => {
    imageRefs.value.forEach((img) => {
      if (img && !img.src) {
        imageObserver?.observe(img);
      }
    });
  });
}

// 图片加载完成
function LoadingDone(item: ExtendedImageItem, index: number, country: string) {
  item.isLoading = false;
}

function LoadingError(item: ExtendedImageItem, index: number, country: string) {
  // 图片加载失败时也停止加载动画
  item.isLoading = false;
  console.error(`图片加载失败: ${CDN.getURL(item.path)}`);
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

// 组件挂载后初始化图片观察器
onMounted(() => {
  initImageObserver();
  
  // 立即检查前几张图片是否已经在视口中（初始可见的图片）
  nextTick(() => {
    imageRefs.value.forEach((img, item) => {
      if (img && !item.shouldLoad) {
        // 使用 getBoundingClientRect 检查是否在视口中
        const rect = img.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 50 && 
                         rect.bottom > -50 && 
                         rect.left < window.innerWidth + 50 && 
                         rect.right > -50;
        
        if (isVisible) {
          item.shouldLoad = true;
          if (imageObserver) {
            imageObserver.unobserve(img);
          }
        }
      }
    });
  });
});

// 组件卸载时清理所有定时器和观察器
onUnmounted(() => {
  // 清理滚动防抖定时器
  Object.values(scrollTimers.value).forEach((timer) => {
    if (timer !== undefined) {
      clearTimeout(timer);
}
  });
  
  // 清理滚动按钮定时器
  Object.values(scrollButtonTimers.value).forEach((timer) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  });
  
  // 清理 Intersection Observer
  if (imageObserver) {
    imageRefs.value.forEach((img) => {
      imageObserver?.unobserve(img);
    });
    imageObserver.disconnect();
    imageObserver = null;
  }
  
  // 清理滚动状态和引用
  scrollRefs.value = {};
  scrollStates.value = {};
  scrollTimers.value = {};
  scrollButtonTimers.value = {};
  initializedCountries.value.clear();
  imageRefs.value.clear();
});
</script>

<style scoped>
.image-gallery-container {
  padding: 2rem 1rem;
  min-height: calc(100vh - 9.75rem);
}

.image-gallery-container.bg-light {
  background: #f5f5f5;
}

.image-gallery-container.bg-dark {
  background: #212529;
}

.gallery-section {
  margin-bottom: 3rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
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

.bg-dark .section-header {
  box-shadow: 
    0 -2px 8px rgba(0,0,0,0.3),
    -2px 0 8px rgba(0,0,0,0.3),
    2px 0 8px rgba(0,0,0,0.3);
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
  /* 只保留下方、左侧和右侧的阴影，移除上方阴影 */
  box-shadow: 
    0 2px 8px rgba(0,0,0,0.1),
    -2px 0 8px rgba(0,0,0,0.1),
    2px 0 8px rgba(0,0,0,0.1);
}

.gallery-content-light {
  background: white;
}

.gallery-content-dark {
  background: #2d333b;
  /* 只保留下方、左侧和右侧的阴影，移除上方阴影 */
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
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  padding: 0.5rem 0;
}

.gallery-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* 渐变遮罩 */
.scroll-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  pointer-events: none;
  z-index: 2;
}

.scroll-fade-left {
  left: 0;
  background: linear-gradient(to right, white, transparent);
}

.scroll-fade-right {
  right: 0;
  background: linear-gradient(to left, white, transparent);
}

.scroll-fade-left.scroll-fade-dark {
  background: linear-gradient(to right, #2d333b, transparent);
}

.scroll-fade-right.scroll-fade-dark {
  background: linear-gradient(to left, #2d333b, transparent);
}

/* 隐藏渐变遮罩 */
.scroll-fade.fade-hidden {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item {
  flex-shrink: 0;
  width: 380px;
  cursor: pointer;
  transition: transform 0.2s;
}

.gallery-item:hover {
  transform: translateY(-4px);
}

.thumbnail-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: #f0f0f0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.bg-dark .thumbnail-wrapper {
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
  border: 2px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-btn-left {
  left: -24px;
  transform: translate(-50%, -50%);
}

.nav-btn-right {
  right: -24px;
  transform: translate(50%, -50%);
}

.nav-btn:hover {
  background: rgba(240, 240, 240, 1);
  border-color: rgba(220, 220, 220, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.bg-dark .nav-btn {
  border: 2px solid rgba(45, 51, 59, 0.9);
  background: rgba(45, 51, 59, 0.95);
  color: #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.bg-dark .nav-btn:hover {
  background: rgba(60, 67, 77, 1);
  border-color: rgba(80, 87, 97, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(45, 51, 59, 0.5);
}

.nav-btn svg {
  font-size: 1rem;
}

/* 隐藏导航按钮 */
.nav-btn.btn-hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
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
