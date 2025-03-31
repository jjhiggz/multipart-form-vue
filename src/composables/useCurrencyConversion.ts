import { useQuery, keepPreviousData } from '@tanstack/vue-query'
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
    queryFn: async ({ queryKey: [, , params] }): Promise<ConversionResponse> => {
      if (!params) throw new Error('Conversion parameters are required')

      const response = await client.currency.convert.$get({
        query: {
          from: params.from,
          to: params.to,
          amount: params.amount.toString(),
        },
      })

      const data = await response.json()
      if ('error' in data) {
        throw new Error(data.error)
      }
      return data
    },
    enabled: !!params.value,
    staleTime: 30000,
    placeholderData: keepPreviousData,
    retry: 1,
  })
}
