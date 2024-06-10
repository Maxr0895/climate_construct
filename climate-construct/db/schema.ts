import { pgTable, text } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidID: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(), 
});

export const update = pgTable("updates", {
    id: text("id").primaryKey(),
    name: text("name"),
 
});

export const insertAccountSchema = createInsertSchema(accounts);