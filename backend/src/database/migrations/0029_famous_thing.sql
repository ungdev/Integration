ALTER TABLE "defi_tc_attribution" RENAME TO "maker_battle_attribution";--> statement-breakpoint
ALTER TABLE "maker_battle_attribution" DROP CONSTRAINT "defi_tc_attribution_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "maker_battle_attribution" ADD COLUMN "table" text NOT NULL;--> statement-breakpoint
ALTER TABLE "maker_battle_attribution" ADD CONSTRAINT "maker_battle_attribution_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;