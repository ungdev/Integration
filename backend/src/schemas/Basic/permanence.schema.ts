import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const permanenceSchema = pgTable("permanences", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  location: text("location"),
  start_at: timestamp("start_at"),
  end_at: timestamp("end_at"),
  capacity: integer("capacity"),
  is_open: boolean("is_open").default(false), // Géré par l'admin
});

export type Permanence = typeof permanenceSchema.$inferSelect;
