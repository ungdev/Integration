import { pgTable, serial, text, integer, pgEnum, date } from "drizzle-orm/pg-core";
import {primaryKey} from "drizzle-orm/pg-core/index";
import { userSchema } from "../Basic/user.schema";

export const busAttributionSchema = pgTable("bus_attribution", {
  user_id: integer('user_id').primaryKey().notNull().references(() => userSchema.id),
  bus: integer("bus").notNull()
});

export type BusAttributionSchema = typeof busAttributionSchema.$inferInsert;
