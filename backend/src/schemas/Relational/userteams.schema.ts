import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { teamSchema } from "../Basic/team.schema";
import { userSchema } from "../Basic/user.schema";

export const userTeamsSchema = pgTable("user_teams", {
    user_id: integer("user_id").references(() => userSchema.id, { onDelete: "cascade" }),
    team_id: integer("team_id").references(() => teamSchema.id, { onDelete: "cascade" }),
},
    (table) => [
        primaryKey({ columns: [table.user_id, table.team_id] })],
);

export type UserTeam = typeof userTeamsSchema.$inferSelect;
