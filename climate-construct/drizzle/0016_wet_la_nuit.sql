ALTER TABLE "transactions" RENAME COLUMN "payee" TO "supplier";
ALTER TABLE "transactions" DROP COLUMN "expense_type";
