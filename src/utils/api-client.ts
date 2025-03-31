import { hc } from 'hono/client'
import type { AppType } from '../../server'

// Create a type-safe client for our Hono backend
const client = hc<AppType>('http://localhost:3000')

export { client }

// Type helpers for responses and requests
export type { InferResponseType, InferRequestType } from 'hono/client'
