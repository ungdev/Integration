import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { challengeSchema } from "../Basic/challenge.schema";
import { userSchema } from "../Basic/user.schema";
import { teamSchema } from "../Basic/team.schema";
import { factionSchema } from "../Basic/faction.schema";

export const challengeValidationSchema = pgTable("challenge_validation", {
  id: serial("id").primaryKey(),
  challenge_id: integer("challenge_id").references(() => challengeSchema.id).notNull(),
  validated_by_admin_id: integer("validated_by_admin_id").references(() => userSchema.id).notNull(),
  validated_at: timestamp("validated_at", { withTimezone: true }).defaultNow().notNull(),
  target_user_id: integer("target_user_id").references(() => userSchema.id),
  target_team_id: integer("target_team_id").references(() => teamSchema.id),
  target_faction_id: integer("target_faction_id").references(() => factionSchema.id),
  points: integer("points").notNull(), // Nombre de points attribués
  added_by_admin_id: integer("added_by_admin_id").references(() => userSchema.id).notNull(), // Qui a validé les points
});

export type ChallengeValidationPoints = typeof challengeValidationSchema.$inferSelect;
