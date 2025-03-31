import { createRouter, createWebHistory } from 'vue-router'
import RawMultipartFlow from '@/views/RawMultipartFlow.vue'
import MultiparterForm from '@/views/MultiparterForm.vue'

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
    {
      path: '/multiparter',
      name: 'multiparter',
      component: MultiparterForm,
    },
  ],
})

export default router
