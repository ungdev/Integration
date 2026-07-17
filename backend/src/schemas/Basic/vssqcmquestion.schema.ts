import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const vssqcmquestionSchema = pgTable('vssqcmquestion', {
    id: serial('id').primaryKey(),
    question: text('question').notNull(),
    points: integer('points').notNull(),
});

export type VssQcmQuestion = typeof vssqcmquestionSchema.$inferSelect;
