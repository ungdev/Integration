import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { vssqcmquestionSchema } from '../Basic/vssqcmquestion.schema';

export const vssqcmanswerSchema = pgTable('vssqcmanswer', {
    id: serial('id').primaryKey(),
    questionid: integer('questionid')
        .references(() => vssqcmquestionSchema.id, { onDelete: 'cascade' })
        .notNull(),
    answer: text('answer').notNull(),
    is_correct: boolean('is_correct').notNull(),
});

export type VssQcmAnswer = typeof vssqcmanswerSchema.$inferSelect;
