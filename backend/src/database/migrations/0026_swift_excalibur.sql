CREATE TYPE "public"."vss_form" AS ENUM('pending', 'toretry', 'validated', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('single_choice', 'multiple_choice');--> statement-breakpoint
CREATE TABLE "vssqcmquestion" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"points" integer NOT NULL,
	"type" "question_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_informations" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"emergency_contact_name" text,
	"emergency_contact_phone" text
);
--> statement-breakpoint
CREATE TABLE "vssqcmanswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"questionid" integer NOT NULL,
	"answer" text NOT NULL,
	"is_correct" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "vss_form" "vss_form" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "user_informations" ADD CONSTRAINT "user_informations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vssqcmanswer" ADD CONSTRAINT "vssqcmanswer_questionid_vssqcmquestion_id_fk" FOREIGN KEY ("questionid") REFERENCES "public"."vssqcmquestion"("id") ON DELETE cascade ON UPDATE no action;