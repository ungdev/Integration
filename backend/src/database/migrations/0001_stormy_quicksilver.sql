CREATE TABLE "factions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	CONSTRAINT "factions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "team_faction" (
	"faction_id" integer,
	"team_id" integer,
	CONSTRAINT "team_faction_faction_id_team_id_pk" PRIMARY KEY("faction_id","team_id")
);
--> statement-breakpoint
ALTER TABLE "user_teams" ADD CONSTRAINT "user_teams_user_id_team_id_pk" PRIMARY KEY("user_id","team_id");--> statement-breakpoint
ALTER TABLE "team_faction" ADD CONSTRAINT "team_faction_faction_id_teams_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_faction" ADD CONSTRAINT "team_faction_team_id_factions_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;