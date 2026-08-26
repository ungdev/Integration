import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { userSchema } from '../Basic/user.schema';

export const MakerBattleAttributionSchema = pgTable('maker_battle_attribution', {
    user_id: integer('user_id')
        .primaryKey()
        .notNull()
        .references(() => userSchema.id),
    maker_team_id: integer('maker_team_id').notNull(),
    table: text('table').notNull(),
    group: text('group').notNull(),
});

export type MakerBattleAttributionSchema = typeof MakerBattleAttributionSchema.$inferInsert;
