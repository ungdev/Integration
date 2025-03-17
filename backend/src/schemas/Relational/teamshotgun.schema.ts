import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { teamSchema } from "../Basic/team.schema";

export const teamShotgunSchema = pgTable("team_shotgun", {
    id: serial("id").primaryKey(),
    team_id: integer("team_id").references(() => teamSchema.id),
    timestamp: timestamp("timestamp").defaultNow(), // Timecode du shotgun
});

export type TeamShotgun = typeof teamShotgunSchema.$inferSelect;