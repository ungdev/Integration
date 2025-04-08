CREATE TABLE "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"points" integer NOT NULL,
	"created_by" integer
);
--> statement-breakpoint
CREATE TABLE "challenge_validations" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"validated_by_admin_id" integer NOT NULL,
	"validated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"target_user_id" integer,
	"target_team_id" integer,
	"target_faction_id" integer
);
--> statement-breakpoint
CREATE TABLE "faction_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" integer NOT NULL,
	"points" integer NOT NULL,
	"reason" text NOT NULL,
	"added_by_admin_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validations" ADD CONSTRAINT "challenge_validations_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validations" ADD CONSTRAINT "challenge_validations_validated_by_admin_id_users_id_fk" FOREIGN KEY ("validated_by_admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validations" ADD CONSTRAINT "challenge_validations_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validations" ADD CONSTRAINT "challenge_validations_target_team_id_teams_id_fk" FOREIGN KEY ("target_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_validations" ADD CONSTRAINT "challenge_validations_target_faction_id_factions_id_fk" FOREIGN KEY ("target_faction_id") REFERENCES "public"."factions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_points" ADD CONSTRAINT "faction_points_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_points" ADD CONSTRAINT "faction_points_added_by_admin_id_users_id_fk" FOREIGN KEY ("added_by_admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;