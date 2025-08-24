CREATE TABLE "respo_permanences" (
	"user_id" integer,
	"permanence_id" integer,
	CONSTRAINT "respo_permanences_user_id_permanence_id_pk" PRIMARY KEY("user_id","permanence_id")
);
--> statement-breakpoint
ALTER TABLE "respo_permanences" ADD CONSTRAINT "respo_permanences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respo_permanences" ADD CONSTRAINT "respo_permanences_permanence_id_permanences_id_fk" FOREIGN KEY ("permanence_id") REFERENCES "public"."permanences"("id") ON DELETE cascade ON UPDATE no action;