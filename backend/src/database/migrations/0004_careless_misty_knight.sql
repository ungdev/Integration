CREATE TABLE "permanences" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"location" text,
	"start_at" timestamp,
	"end_at" timestamp,
	"capacity" integer,
	"is_open" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "user_permanences" (
	"user_id" integer,
	"permanence_id" integer,
	"registered_at" timestamp DEFAULT now(),
	CONSTRAINT "user_permanences_user_id_permanence_id_pk" PRIMARY KEY("user_id","permanence_id")
);
--> statement-breakpoint
ALTER TABLE "user_permanences" ADD CONSTRAINT "user_permanences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permanences" ADD CONSTRAINT "user_permanences_permanence_id_permanences_id_fk" FOREIGN KEY ("permanence_id") REFERENCES "public"."permanences"("id") ON DELETE cascade ON UPDATE no action;