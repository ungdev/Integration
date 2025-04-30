import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const newsSchema = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  type: text("type"),
  published: boolean("published").default(false),
  target: text("target"), // "Tous", "Nouveau", "CE", "Orgas", "Admin", ...
  created_at: timestamp("created_at").defaultNow(),
});

export type News = typeof newsSchema.$inferSelect;