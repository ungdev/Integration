CREATE TABLE "vssqcmquestion" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"points" integer NOT NULL,
	"type" "question_type" NOT NULL
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
ALTER TABLE "vssqcmanswer" ADD CONSTRAINT "vssqcmanswer_questionid_vssqcmquestion_id_fk" FOREIGN KEY ("questionid") REFERENCES "public"."vssqcmquestion"("id") ON DELETE cascade ON UPDATE no action;