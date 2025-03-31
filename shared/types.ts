import { z } from 'zod'

export const currencySchema = z.enum([
  'EUR', // Euro
  'USD', // US Dollar
  'GBP', // British Pound Sterling
  'JPY', // Japanese Yen
  'CHF', // Swiss Franc
  'CAD', // Canadian Dollar
  'AUD', // Australian Dollar
  'CNY', // Chinese Yuan
])

export type Currency = z.infer<typeof currencySchema>

export const CURRENCY_OPTIONS = currencySchema.options
