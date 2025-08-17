import { pgTable, serial, integer, primaryKey } from "drizzle-orm/pg-core";
import { roleSchema } from "../Basic/role.schema";

export const rolePoints = pgTable("role_points", {
  role_id: integer("role_points").references(() => roleSchema.id, { onDelete: "cascade" }).unique(),
  points: integer("points"),
},
(table) => [
  primaryKey({ columns: [table.role_id]}) ],
);

export type RolePoints = typeof rolePoints.$inferSelect;
