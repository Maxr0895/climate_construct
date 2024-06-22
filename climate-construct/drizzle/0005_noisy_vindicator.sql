ALTER TABLE "accounts" ADD COLUMN "division" text;
ALTER TABLE "accounts" ADD COLUMN "start_date" DATE;
ALTER TABLE "accounts" ADD COLUMN "end_date" DATE;
ALTER TABLE accounts ADD COLUMN operational_control BOOLEAN,
ALTER TABLE accounts ADD COLUMN project_code TEXT;