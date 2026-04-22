import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { roleSchema } from "../Basic/role.schema";
import { userSchema } from "../Basic/user.schema";

export const userRolesSchema = pgTable("user_roles", {
    user_id: integer("user_id").notNull().references(() => userSchema.id, { onDelete: "cascade" }),
    role_id: integer("role_id").notNull().references(() => roleSchema.id, { onDelete: "cascade" }),
});

export type UserRole = typeof userRolesSchema.$inferSelect;

export const userPreferencesSchema = pgTable("user_preferences", {
    userId: integer("user_id").notNull().references(() => userSchema.id, { onDelete: "cascade" }),
    roleId: integer("role_id").notNull().references(() => roleSchema.id, { onDelete: "cascade" }),
}, (table) => [
    primaryKey({ columns: [table.userId, table.roleId] })],
);

export type UserPreference = typeof userPreferencesSchema.$inferSelect;
