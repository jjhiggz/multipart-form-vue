import { useQuery } from '@tanstack/vue-query'
import { client } from '@/utils/api-client'
import type { Currency } from '@/types'
import type { Ref, ComputedRef } from 'vue'

export interface ConversionResponse {
  from: Currency
  to: Currency
  amount: number
  convertedAmount: number
  rate: number
}

export interface ConversionParams {
  from: Currency
  to: Currency
  amount: number
}

export function useCurrencyConversion(params: ComputedRef<ConversionParams | null>) {
  return useQuery({
    queryKey: ['currency', 'convert', params.value] as const,
    queryFn: async () => {
      if (!params.value) throw new Error('Conversion parameters are required')

      const response = await client.currency.convert.$get({
        query: {
          from: params.value.from,
          to: params.value.to,
          amount: params.value.amount.toString(),
        },
      })
      return await response.json().then((response) => {
        if ('error' in response) return null
        else return response
      })
    },
    enabled: !!params.value, // Only run the query if we have parameters
    staleTime: 30000, // Consider rates fresh for 30 seconds
  })
}
