import {
  pgTable,
  bigserial,
  text,
  timestamp
} from 'drizzle-orm/pg-core';

export const tinyWin = pgTable('tiny-win', {
  id: bigserial('id', { mode: 'number' }).primaryKey(), 
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow()
});
