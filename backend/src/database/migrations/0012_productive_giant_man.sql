CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"type" text,
	"published" boolean DEFAULT false,
	"target" text,
	"created_at" timestamp DEFAULT now()
);
