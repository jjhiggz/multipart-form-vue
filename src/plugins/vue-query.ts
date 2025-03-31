import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query'
import type { App } from 'vue'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 3,
    },
  },
})

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
}

export function setupVueQuery(app: App) {
  app.use(VueQueryPlugin, vueQueryPluginOptions)
}

export { queryClient }
