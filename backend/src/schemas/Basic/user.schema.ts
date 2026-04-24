import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userSchema = pgTable("users", {
    id: serial("id").primaryKey(),
    first_name: text("first_name"),
    last_name: text("last_name"),
    email: text("email").unique(),
    majeur: boolean("majeur"),
    branch: text("branch"),
    contact: text("contact"),
    password: text("password"),
    permission: text("permission").default("Nouveau"),  // Par défaut, le rôle sera "Nouveau"
    discord_id: text("discord_id"),
    created_at: timestamp("created_at").defaultNow(),
});

export type User = typeof userSchema.$inferSelect;
