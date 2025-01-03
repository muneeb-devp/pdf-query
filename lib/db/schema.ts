import { integer, pgEnum, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { pgTable, serial } from 'drizzle-orm/pg-core'

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', { length: 128 }).notNull(),
  fileKey: text('file_key').notNull(),
})

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .references(() => chats.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role: userSystemEnum('role').notNull(),
})

export const userSubscription = pgTable('user_subscription', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 32 }).notNull(),
  userId: varchar('user_id', { length: 64 }).notNull().unique(),
  customerId: integer('customer_id').notNull(),
  username: varchar('username', { length: 64 }).notNull(),
  userEmail: varchar('user_email', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type DrizzleChat = typeof chats.$inferSelect

