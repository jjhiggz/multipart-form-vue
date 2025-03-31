import { useQuery } from '@tanstack/vue-query'
import { client } from '@/utils/api-client'

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

export function useRecipients() {
  return useQuery<RecipientsResponse>({
    queryKey: ['recipients'],
    queryFn: async () => {
      const response = await client.recipients.$get()
      const data = await response.json()
      return data as RecipientsResponse
    },
  })
}

export function useRecipient(id: string) {
  return useQuery<Recipient>({
    queryKey: ['recipients', id],
    queryFn: async () => {
      const response = await client.recipients[':id'].$get({
        param: { id },
      })
      const data = await response.json()
      return data as Recipient
    },
  })
}
