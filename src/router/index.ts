import { createRouter, createWebHistory } from 'vue-router'
import BasicForm from '../views/BasicForm.vue'
import MultiparterForm from '../views/MultiparterForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/basic',
    },
    {
      path: '/basic',
      name: 'basic',
      component: BasicForm,
    },
    {
      path: '/multiparter',
      name: 'multiparter',
      component: MultiparterForm,
    },
  ],
})

export default router
