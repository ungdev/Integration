ALTER TABLE "team_faction" DROP CONSTRAINT "team_faction_faction_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "team_faction" DROP CONSTRAINT "team_faction_team_id_factions_id_fk";
--> statement-breakpoint
ALTER TABLE "team_faction" ADD CONSTRAINT "team_faction_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_faction" ADD CONSTRAINT "team_faction_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;