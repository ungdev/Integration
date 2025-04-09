import { pgTable, serial, text, timestamp, integer, date } from "drizzle-orm/pg-core";
import { permission } from "process";

// Définition de la table `users`
export const userSchema = pgTable("users", {
  id: serial("id").primaryKey(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  email: text("email").unique(),
  birthday: text("birthday"),
  branch: text("branch"),
  contact: text("contact"),
  password: text("password"),
  permission: text("permission").default("Nouveau"),  // Par défaut, le rôle sera "Nouveau"
  created_at: timestamp("created_at").defaultNow(),
});

export type User = typeof userSchema.$inferSelect;
