import { pgTable, integer, text } from 'drizzle-orm/pg-core';
import { userSchema } from '../Basic/user.schema';

export const userInformationSchema = pgTable('user_informations', {
    user_id: integer('user_id')
        .primaryKey()
        .references(() => userSchema.id, { onDelete: 'cascade' }),
    emergency_contact_name: text('emergency_contact_name'),
    emergency_contact_phone: text('emergency_contact_phone'),
});

export type UserInformation = typeof userInformationSchema.$inferSelect;
