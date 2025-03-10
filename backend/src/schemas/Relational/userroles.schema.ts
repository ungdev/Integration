import { pgTable, serial, integer, primaryKey } from "drizzle-orm/pg-core";
import { userSchema } from "../Basic/user.schema";
import { roleSchema } from "../Basic/role.schema";

// Définition de la table `user_roles` pour gérer la relation many-to-many entre users et roles
export const userRolesSchema = pgTable("user_roles", {
  user_id: integer("user_id").notNull().references(() => userSchema.id, { onDelete: "cascade" }),
  role_id: integer("role_id").notNull().references(() => roleSchema.id, { onDelete: "cascade" }),
});

export type UserRole = typeof userRolesSchema.$inferSelect;

export const userPreferencesSchema = pgTable("user_preferences", {
  userId: integer("user_id").notNull().references(() => userSchema.id, { onDelete: "cascade" }),
  roleId: integer("role_id").notNull().references(() => roleSchema.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.roleId] }),
}));

export type UserPreference = typeof userPreferencesSchema.$inferSelect;
