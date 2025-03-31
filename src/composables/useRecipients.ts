import { useQuery } from '@tanstack/vue-query'
import { client } from '@/utils/api-client'
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

// Define the response type
export interface RecipientsResponse {
  recipients: Array<{
    id: string
    name: string
    email: string
    type: 'individual' | 'company'
    currency: 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'CNY'
  }>
  count: number
}

export type Recipient = RecipientsResponse['recipients'][0]

export function useRecipients(initialName = '') {
  const nameQuery = ref(initialName)

  const fetchRecipients = useDebounceFn(async (name: string) => {
    const response = await client.recipients.$get({
      query: { name: name || undefined },
    })
    const data = await response.json()
    return data as RecipientsResponse
  }, 300)

  const query = useQuery({
    queryKey: ['recipients', nameQuery] as const,
    queryFn: () => fetchRecipients(nameQuery.value),
    staleTime: 10000, // Consider data fresh for 10 seconds
    placeholderData: (previousData) => previousData, // Keep showing previous results while fetching new ones
  })

  const setNameQuery = (name: string) => {
    nameQuery.value = name
  }

  return {
    ...query,
    nameQuery,
    setNameQuery,
  }
}

export function useRecipient(id: string) {
  return useQuery({
    queryKey: ['recipients', id] as const,
    queryFn: async () => {
      const response = await client.recipients[':id'].$get({
        param: { id },
      })
      const data = await response.json()
      return data as Recipient
    },
  })
}
