import { pgTable, serial, integer, primaryKey } from "drizzle-orm/pg-core";
import { teamSchema } from "../Basic/team.schema";
import { factionSchema } from "../Basic/faction.schema";

// Définition de la table `user_teams` pour gérer la relation many-to-many entre users et teams
export const teamFactionSchema = pgTable("team_faction", {
  faction_id: integer("faction_id").references(() => factionSchema.id, { onDelete: "cascade" }),
  team_id: integer("team_id").references(() => teamSchema.id, { onDelete: "cascade" }),
},
(table) => [
  primaryKey({ columns: [table.faction_id, table.team_id]}) ],
);

export type userFaction = typeof teamFactionSchema.$inferSelect;
