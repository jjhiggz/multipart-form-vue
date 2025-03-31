import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
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

// Define schema
const recipientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  type: z.enum(['individual', 'group']).default('individual'),
  defaultCurrency: currencySchema,
})

export type Recipient = z.infer<typeof recipientSchema>

// In-memory storage
const recipients: Recipient[] = [
  {
    id: '1',
    name: 'Chad Thunderbolt III',
    email: 'chad@example.com',
    type: 'individual',
    defaultCurrency: 'USD',
  },
  {
    id: '2',
    name: 'Pierre Baguette-Croissant',
    email: 'pierre@example.com',
    type: 'individual',
    defaultCurrency: 'EUR',
  },
  {
    id: '3',
    name: 'Sir Reginald Teacup',
    email: 'reggie@example.com',
    type: 'individual',
    defaultCurrency: 'GBP',
  },
  {
    id: '4',
    name: 'Takeshi Nintendo-San',
    email: 'takeshi@example.com',
    type: 'individual',
    defaultCurrency: 'JPY',
  },
  {
    id: '5',
    name: 'Hans von Clockmaker',
    email: 'hans@example.com',
    type: 'individual',
    defaultCurrency: 'CHF',
  },
  {
    id: '6',
    name: 'Maple Poutine-Hockey',
    email: 'maple@example.com',
    type: 'individual',
    defaultCurrency: 'CAD',
  },
  {
    id: '7',
    name: 'Bruce Kangaroomate',
    email: 'bruce@example.com',
    type: 'individual',
    defaultCurrency: 'AUD',
  },
  {
    id: '8',
    name: 'Li Dynasty-Dragon',
    email: 'li@example.com',
    type: 'individual',
    defaultCurrency: 'CNY',
  },
  {
    id: '9',
    name: 'Global Dev Ninjas',
    email: 'ninjas@example.com',
    type: 'group',
    defaultCurrency: 'USD',
  },
  {
    id: '10',
    name: 'International Money Movers',
    email: 'movers@example.com',
    type: 'group',
    defaultCurrency: 'EUR',
  },
]

const app = new Hono()

// Middleware
app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: true,
  }),
)

// Routes
app.get('/recipients', (c) => {
  return c.json({
    recipients,
    count: recipients.length,
  })
})

app.get('/recipients/:id', (c) => {
  const id = c.req.param('id')
  const recipient = recipients.find((r) => r.id === id)

  if (!recipient) {
    return c.json({ error: 'Recipient not found' }, 404)
  }

  return c.json(recipient)
})

// Error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message,
    },
    500,
  )
})

// Start server
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
