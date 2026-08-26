ALTER TABLE "maker_battle_attribution" RENAME COLUMN "team" TO "maker_team_id";--> statement-breakpoint
ALTER TABLE "maker_battle_attribution" ADD COLUMN "group" text NOT NULL;