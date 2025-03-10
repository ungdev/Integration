import { pgTable, serial, text } from "drizzle-orm/pg-core";

// Définition de la table `roles`
export const roleSchema = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").unique(),  // Le nom du rôle (ex: "Animation", "Bouffe")
  description: text("description"),  // Description du rôle
});

export type Role = typeof roleSchema.$inferSelect;
