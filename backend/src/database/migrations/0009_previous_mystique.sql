CREATE TABLE "bus_attribution" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"bus" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "birthday" TO "majeur";--> statement-breakpoint
ALTER TABLE "bus_attribution" ADD CONSTRAINT "bus_attribution_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;