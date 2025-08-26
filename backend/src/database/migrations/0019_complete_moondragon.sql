ALTER TABLE "permanences" ADD COLUMN "difficulty" integer;--> statement-breakpoint
ALTER TABLE "user_permanences" ADD COLUMN "claimed" boolean DEFAULT false;