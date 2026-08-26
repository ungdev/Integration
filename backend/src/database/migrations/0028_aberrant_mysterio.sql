CREATE TABLE "defi_tc_attribution" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"team" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "defi_tc_attribution" ADD CONSTRAINT "defi_tc_attribution_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;