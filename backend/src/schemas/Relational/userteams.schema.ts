import { pgTable, serial, integer, primaryKey } from "drizzle-orm/pg-core";
import { userSchema } from "../Basic/user.schema";
import { teamSchema } from "../Basic/team.schema";

// Définition de la table `user_teams` pour gérer la relation many-to-many entre users et teams
export const userTeamsSchema = pgTable("user_teams", {
  user_id: integer("user_id").references(() => userSchema.id, { onDelete: "cascade" }),
  team_id: integer("team_id").references(() => teamSchema.id, { onDelete: "cascade" }),
},
(table) => [
  primaryKey({ columns: [table.user_id, table.team_id]}) ],
);

export type UserTeam = typeof userTeamsSchema.$inferSelect;
