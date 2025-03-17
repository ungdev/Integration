ALTER TABLE "shotgun" RENAME TO "team_shotgun";--> statement-breakpoint
ALTER TABLE "team_shotgun" DROP CONSTRAINT "shotgun_team_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "team_shotgun" ADD CONSTRAINT "team_shotgun_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;