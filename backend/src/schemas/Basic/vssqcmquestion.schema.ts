import { integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const questionTypeEnum = pgEnum('question_type', ['single_choice', 'multiple_choice']);

export const vssqcmquestionSchema = pgTable('vssqcmquestion', {
    id: serial('id').primaryKey(),
    question: text('question').notNull(),
    question_en: text('question_en'),
    points: integer('points').notNull(),
    type: questionTypeEnum('type').notNull(),
});

export type VssQcmQuestion = typeof vssqcmquestionSchema.$inferSelect;
