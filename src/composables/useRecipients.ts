import { useQuery } from '@tanstack/vue-query'
import { client } from '@/utils/api-client'

export function useRecipients() {
  return useQuery({
    queryKey: ['recipients'],
    queryFn: async () => {
      const response = await client.recipients.$get()
      return response.json()
    },
  })
}

export function useRecipient(id: string) {
  return useQuery({
    queryKey: ['recipients', id],
    queryFn: async () => {
      const response = await client.recipients[':id'].$get({
        param: { id },
      })
      return response.json()
    },
  })
}
