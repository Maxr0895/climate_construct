ALTER TABLE "suppliers" RENAME TO "subcontractors";--> statement-breakpoint
ALTER TABLE "subcontractors" DROP CONSTRAINT "suppliers_account_id_accounts_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractors" ADD CONSTRAINT "subcontractors_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
