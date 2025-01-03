import type { Config } from 'drizzle-kit'

export default {
  dialect: 'postgresql',
  schema: './lib/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION_STRING || '',
  },
} satisfies Config
