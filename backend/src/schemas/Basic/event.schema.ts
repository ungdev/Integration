import { boolean, pgTable, serial } from "drizzle-orm/pg-core";

export const eventSchema = pgTable("events", {
    id: serial("id").primaryKey(),
    pre_registration_open: boolean("pre_registration_open").default(false),
    shotgun_open: boolean("shotgun_open").default(false),
    sdi_open: boolean("sdi_open").default(false),
    wei_open: boolean("wei_open").default(false),
    food_open: boolean("wei_open").default(false),
  });

export type Event = typeof eventSchema.$inferSelect;