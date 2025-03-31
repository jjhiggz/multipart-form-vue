import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { client } from '@/utils/api-client'
import type { Currency } from '@/types'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

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

// Accept MaybeRefOrGetter for more flexible reactivity handling
export function useCurrencyConversion(params: MaybeRefOrGetter<ConversionParams | null>) {
  return useQuery({
    // Place the reactive value directly in queryKey for automatic tracking
    queryKey: ['currency', 'convert', params] as const,
    queryFn: async ({ queryKey: [, , currentParams] }): Promise<ConversionResponse> => {
      const resolvedParams = toValue(currentParams)
      if (!resolvedParams) throw new Error('Conversion parameters are required')

      const response = await client.currency.convert.$get({
        query: {
          from: resolvedParams.from,
          to: resolvedParams.to,
          amount: resolvedParams.amount.toString(),
        },
      })

      const data = await response.json()
      if ('error' in data) {
        throw new Error(data.error)
      }
      return data
    },
    // Use reactive getter for enabled to track dependencies
    enabled: () => !!toValue(params),
    staleTime: 30000,
    placeholderData: keepPreviousData,
    retry: 1,
  })
}
