CREATE TABLE "banned_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	CONSTRAINT "banned_addresses_email_unique" UNIQUE("email")
);
