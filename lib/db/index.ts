import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

neonConfig.fetchConnectionCache = true

if (!process.env.DATABASE_CONNECTION_STRING)
  throw new Error('DB connection string not found!')

const sql = neon(process.env.DATABASE_CONNECTION_STRING)
export const db = drizzle(sql)
