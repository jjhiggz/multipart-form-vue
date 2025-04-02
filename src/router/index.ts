import { createRouter, createWebHistory } from 'vue-router'
import RawMultipartFlow from '@/views/RawMultipartFlow.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/raw',
    },
    {
      path: '/raw',
      name: 'raw',
      component: RawMultipartFlow,
    },
  ],
})

export default router
