import { createRouter, createWebHistory } from "vue-router";
import { config } from "@/config";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { title: "首页" },
    },
    {
      path: "/image",
      name: "image",
      component: () => import("@/views/ImageView.vue"),
      meta: { title: "摄影" },
    },
    {
      path: "/markdown",
      redirect: "/home",
    },
    {
      path: "/markdown/:id",
      name: "markdown",
      component: () => import("@/views/MarkdownView.vue"),
      meta: { title: "文章详情" },
    },
    {
      path: "/loading",
      name: "loading",
      component: () => import("@/views/LoadingView.vue"),
      meta: { title: "加载中" },
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/views/TestView.vue"),
      meta: { title: "测试" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("@/views/404View.vue"),
      meta: { title: "页面未找到" },
    },
  ],
});

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  const title = to.meta?.title as string;
  if (title) {
    document.title = `${title} - ${config.app.author.name}'s Blog`;
  } else {
    document.title = `${config.app.author.name}'s Blog`;
  }
  next();
});

export default router;
