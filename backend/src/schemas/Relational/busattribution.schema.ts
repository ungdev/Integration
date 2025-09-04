import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { userSchema } from "../Basic/user.schema";

export const busAttributionSchema = pgTable("bus_attribution", {
  user_id: integer('user_id').primaryKey().notNull().references(() => userSchema.id),
  bus: integer("bus").notNull(),
  departure_time : text("departure_time").notNull(),
});

export type BusAttributionSchema = typeof busAttributionSchema.$inferInsert;
