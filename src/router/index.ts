import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/image',
      name: 'image',
      component: () => import('@/views/ImageView.vue')
    },
    {
      path:'/markdown',
      redirect: '/home'
    },
    {
      path:'/markdown/:id',
      name: 'markdown',
      component: () => import('@/views/MarkdownView.vue'),    
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/404View.vue')
    },
  ]
})

export default router
