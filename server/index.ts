import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

// Define recipient schema
const recipientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  type: z.enum(['individual', 'company']),
})

type Recipient = z.infer<typeof recipientSchema>

// In-memory storage
const recipients: Recipient[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', type: 'individual' },
  { id: '2', name: 'Acme Corp', email: 'contact@acme.com', type: 'company' },
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
