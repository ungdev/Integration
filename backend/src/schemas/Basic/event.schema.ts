import { boolean, pgTable, serial } from "drizzle-orm/pg-core";

export const eventSchema = pgTable("events", {
    id: serial("id").primaryKey(),
    pre_registration_open: boolean("pre_registration_open").default(false),
    shotgun_open: boolean("shotgun_open").default(false),
  });

export type Event = typeof eventSchema.$inferSelect;