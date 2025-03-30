import { createRouter, createWebHistory } from 'vue-router'
import BasicForm from '../components/demos/BasicForm.vue'
import MultiparterForm from '../components/demos/MultiparterForm.vue'
import ComparisonView from '../components/demos/ComparisonView.vue'

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
    {
      path: '/comparison',
      name: 'comparison',
      component: ComparisonView,
    },
  ],
})

export default router
