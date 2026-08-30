CREATE TABLE "maker_battle_attribution" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"maker_team_id" integer NOT NULL,
	"faction_id" integer NOT NULL,
	"table" integer,
	"group" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "maker_battle_attribution" ADD CONSTRAINT "maker_battle_attribution_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;