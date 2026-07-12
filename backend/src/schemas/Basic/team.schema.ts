import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const teamSchema = pgTable('teams', {
    id: serial('id').primaryKey(),
    name: text('name').unique(), // Le nom de l'équipe
    description: text('description'), // Description de l'équipe
    type: text('type'),
    social_link: text('socialLink'),
});

export type Team = typeof teamSchema.$inferSelect;
