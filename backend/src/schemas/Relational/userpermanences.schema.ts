import { pgTable, integer, primaryKey, timestamp, boolean } from "drizzle-orm/pg-core";
import { userSchema } from "../Basic/user.schema";
import { permanenceSchema } from "../Basic/permanence.schema";

export const userPermanenceSchema = pgTable("user_permanences", {
  user_id: integer("user_id").references(() => userSchema.id, { onDelete: "cascade" }),
  permanence_id: integer("permanence_id").references(() => permanenceSchema.id, { onDelete: "cascade" }),
  registered_at: timestamp("registered_at").defaultNow(),
  claimed: boolean("claimed").default(false),
}, 
(table) => [
  primaryKey({ columns: [table.user_id, table.permanence_id] }),
]);

export type UserPermanence = typeof userPermanenceSchema.$inferSelect;

export const respoPermanenceSchema = pgTable("respo_permanences", {
  user_id: integer("user_id").references(() => userSchema.id, { onDelete: "cascade" }),
  permanence_id: integer("permanence_id").references(() => permanenceSchema.id, { onDelete: "cascade" }),
}, 
(table) => [
  primaryKey({ columns: [table.user_id, table.permanence_id] }),
]);

export type RespoPermanence = typeof userPermanenceSchema.$inferSelect;
