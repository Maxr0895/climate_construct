CREATE TABLE IF NOT EXISTS "subcontractors" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"supplier" text NOT NULL,
	"expense_category" text,
	"units" text,
	"volume" numeric,
	"notes" text,
	"date" date NOT NULL,
	"account_id" text NOT NULL,
	"category_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractors" ADD CONSTRAINT "subcontractors_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractors" ADD CONSTRAINT "subcontractors_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
