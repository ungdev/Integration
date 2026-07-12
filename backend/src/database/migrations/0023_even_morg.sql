CREATE TABLE "user_informations" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"urgency_contact_name" text,
	"urgency_contact_phone" text,
	"contact_CE" text
);
--> statement-breakpoint
ALTER TABLE "user_informations" ADD CONSTRAINT "user_informations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;