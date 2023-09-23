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

// drizzle-kit provides utility functions e.g. migrations
// To apply migrations, type in terminal
//  bun drizzle-kit push:pg
// To see your database tables, type in terminal
//  bun drizzle-kit studio
