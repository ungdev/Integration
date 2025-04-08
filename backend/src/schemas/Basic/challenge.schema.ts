import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const challengeSchema = pgTable("challenges", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    points: integer("points").notNull(),
    created_by: integer("created_by").references(() => userSchema.id), // l'admin qui l'a créé
  });
  export type Challenge = typeof challengeSchema.$inferSelect;
  