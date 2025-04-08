CREATE TABLE "challenge_validation" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"validated_by_admin_id" integer NOT NULL,
	"validated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"target_user_id" integer,
	"target_team_id" integer,
	"target_faction_id" integer,
	"points" integer NOT NULL,
	"added_by_admin_id" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "challenge_validations" CASCADE;--> statement-breakpoint
DROP TABLE "faction_points" CASCADE;--> statement-breakpoint
ALTER TABLE "challenge_validation" ADD CONSTRAINT "challenge_validation_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validation" ADD CONSTRAINT "challenge_validation_validated_by_admin_id_users_id_fk" FOREIGN KEY ("validated_by_admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validation" ADD CONSTRAINT "challenge_validation_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validation" ADD CONSTRAINT "challenge_validation_target_team_id_teams_id_fk" FOREIGN KEY ("target_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validation" ADD CONSTRAINT "challenge_validation_target_faction_id_factions_id_fk" FOREIGN KEY ("target_faction_id") REFERENCES "public"."factions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validation" ADD CONSTRAINT "challenge_validation_added_by_admin_id_users_id_fk" FOREIGN KEY ("added_by_admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;