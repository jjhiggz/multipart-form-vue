import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

// Define currency schema
const currencySchema = z.enum([
  'EUR', // Euro
  'USD', // US Dollar
  'GBP', // British Pound Sterling
  'JPY', // Japanese Yen
  'CHF', // Swiss Franc
  'CAD', // Canadian Dollar
  'AUD', // Australian Dollar
  'CNY', // Chinese Yuan
])

type Currency = z.infer<typeof currencySchema>

// Define recipient schema
const recipientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  type: z.enum(['individual', 'company']),
  currency: currencySchema,
})

type Recipient = z.infer<typeof recipientSchema>

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

// CORS middleware
app.use(
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

// Get all recipients
app.get('/recipients', (c) => {
  return c.json({
    recipients,
    count: recipients.length,
  })
})

// Get recipient by ID
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

// Start the server
const port = 3000
console.log(`Server is running on port ${port}`)

export type AppType = typeof app
export default app
