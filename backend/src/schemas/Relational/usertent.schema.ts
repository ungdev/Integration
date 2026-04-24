import { boolean, integer, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { userSchema } from "../Basic/user.schema";

export const userTentSchema = pgTable("user_tent", {
    user_id_1: integer("user_id_1").references(() => userSchema.id, { onDelete: "cascade" }),
    user_id_2: integer("user_id_2").references(() => userSchema.id, { onDelete: "cascade" }),
    confirmed: boolean("confirmed").default(false), // optionnel : pour savoir si les deux ont validé
    created_at: timestamp("created_at").defaultNow(),
}, (table) => [
    primaryKey({ columns: [table.user_id_1, table.user_id_2] }),
]);

export type UserTent = typeof userTentSchema.$inferSelect;
