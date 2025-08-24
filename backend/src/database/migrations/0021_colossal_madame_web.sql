CREATE TABLE "user_tent" (
	"user_id_1" integer,
	"user_id_2" integer,
	"confirmed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_tent_user_id_1_user_id_2_pk" PRIMARY KEY("user_id_1","user_id_2")
);
--> statement-breakpoint
ALTER TABLE "user_tent" ADD CONSTRAINT "user_tent_user_id_1_users_id_fk" FOREIGN KEY ("user_id_1") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tent" ADD CONSTRAINT "user_tent_user_id_2_users_id_fk" FOREIGN KEY ("user_id_2") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;