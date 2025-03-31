import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { currencySchema, type Currency } from '../shared/types'

// Define recipient schema
const recipientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  type: z.enum(['individual', 'company']),
  currency: currencySchema,
})

type Recipient = z.infer<typeof recipientSchema>

// Type for conversion rates
type ConversionRates = {
  [K in Currency]?: {
    [T in Currency]?: number
  }
}

// Currency conversion rates (ratio of target currency per base currency)
const conversionRates: ConversionRates = {
  USD: {
    EUR: 0.85, // 1 USD = 0.85 EUR
    GBP: 0.73,
    JPY: 110.0,
    CHF: 0.92,
    CAD: 1.25,
    AUD: 1.35,
    CNY: 6.45,
  },
  EUR: {
    USD: 1.18,
    GBP: 0.86,
    JPY: 129.5,
    CHF: 1.08,
    CAD: 1.47,
    AUD: 1.59,
    CNY: 7.59,
  },
  GBP: {
    USD: 1.37,
    EUR: 1.16,
    JPY: 150.7,
    CHF: 1.26,
    CAD: 1.71,
    AUD: 1.85,
    CNY: 8.83,
  },
}

// Generate reverse rates for all currency pairs
Object.entries(conversionRates).forEach(([baseCurrency, rates]) => {
  if (rates) {
    Object.entries(rates).forEach(([targetCurrency, rate]) => {
      if (!conversionRates[targetCurrency as Currency]) {
        conversionRates[targetCurrency as Currency] = {}
      }
      if (conversionRates[targetCurrency as Currency]) {
        conversionRates[targetCurrency as Currency]![baseCurrency as Currency] = Number(
          (1 / rate).toFixed(4),
        )
      }
    })
  }
})

const app = new Hono()
  .use(
    '/*',
    cors({
      origin: 'http://localhost:5173',
      allowMethods: ['GET', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    }),
  )
  .get(
    '/recipients',
    zValidator(
      'query',
      z.object({
        name: z.string().optional(),
      }),
    ),
    (c) => {
      const { name } = c.req.valid('query')

      const filteredRecipients = name
        ? recipients.filter((recipient) => {
            const searchTerm = name.toLowerCase()
            return (
              recipient.name.toLowerCase().includes(searchTerm) ||
              recipient.email.toLowerCase().includes(searchTerm)
            )
          })
        : recipients

      return c.json({
        recipients: filteredRecipients,
        count: filteredRecipients.length,
      })
    },
  )
  .get('/recipients/:id', (c) => {
    const id = c.req.param('id')
    const recipient = recipients.find((r) => r.id === id)

    if (!recipient) {
      return c.json({ error: 'Recipient not found' }, 404)
    }

    return c.json(recipient)
  })
  .get(
    '/currency/convert',
    zValidator(
      'query',
      z.object({
        from: currencySchema,
        to: currencySchema,
        amount: z.string().transform((val) => Number(val)),
      }),
    ),
    (c) => {
      const { from, to, amount } = c.req.valid('query')

      // Check if we have a conversion rate for this pair
      const fromRates = conversionRates[from]
      if (!fromRates || !fromRates[to]) {
        return c.json(
          {
            error: `Conversion rate not available for ${from} to ${to}`,
          },
          400,
        )
      }

      const rate = fromRates[to]!
      const convertedAmount = Number((amount * rate).toFixed(2))

      return c.json({
        from,
        to,
        amount,
        convertedAmount,
        rate: Number(rate.toFixed(4)),
      })
    },
  )
  .get('/currencies', (c) => {
    return c.json(Object.keys(conversionRates))
  })
  .onError((err, c) => {
    console.error(`${err}`)
    return c.json(
      {
        error: 'Internal Server Error',
        message: err.message,
      },
      500,
    )
  })

// In-memory storage
const recipients: Recipient[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    type: 'individual',
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Acme Corp',
    email: 'contact@acme.com',
    type: 'company',
    currency: 'EUR',
  },
  {
    id: '3',
    name: 'British Tea Co',
    email: 'tea@british.co.uk',
    type: 'company',
    currency: 'GBP',
  },
  {
    id: '4',
    name: 'Tokyo Tech',
    email: 'info@tokyotech.jp',
    type: 'company',
    currency: 'JPY',
  },
  {
    id: '5',
    name: 'Swiss Bank',
    email: 'private@swissbank.ch',
    type: 'company',
    currency: 'CHF',
  },
]

// Start the server
const port = 3000
console.log(`Server is running on port ${port}`)

export type AppType = typeof app
export default app
