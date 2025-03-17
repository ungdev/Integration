CREATE TABLE "shotgun_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"pre_registration_open" boolean DEFAULT false,
	"shotgun_open" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "shotgun" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "shotgun" ADD CONSTRAINT "shotgun_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;