import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { factionSchema } from "../Basic/faction.schema";
import { teamSchema } from "../Basic/team.schema";

export const teamFactionSchema = pgTable("team_faction", {
    faction_id: integer("faction_id").references(() => factionSchema.id, { onDelete: "cascade" }),
    team_id: integer("team_id").references(() => teamSchema.id, { onDelete: "cascade" }),
},
    (table) => [
        primaryKey({ columns: [table.faction_id, table.team_id] })],
);

export type userFaction = typeof teamFactionSchema.$inferSelect;
