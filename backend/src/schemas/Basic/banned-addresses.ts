import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const bannedAddressesSchema = pgTable('banned_addresses', {
    id: serial('id').primaryKey(),
    email: text('email').unique(),
});

export type BannedAddress = typeof bannedAddressesSchema.$inferSelect;
