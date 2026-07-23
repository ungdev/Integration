CREATE TABLE "banned_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	CONSTRAINT "banned_addresses_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_informations" RENAME COLUMN "urgency_contact_name" TO "emergency_contact_name";--> statement-breakpoint
ALTER TABLE "user_informations" RENAME COLUMN "urgency_contact_phone" TO "emergency_contact_phone";