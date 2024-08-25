import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { 
  integer, 
  pgTable, 
  numeric,
  text, 
  timestamp,
  date
} from "drizzle-orm/pg-core";
import { decimal } from "drizzle-orm/mysql-core";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  division: text("division"), 
  startDate: date("start_date"), // Add start date column
  endDate: date("end_date"), // Add end date column
  operationalControl: text("operational_control"), // Add operational control column
  projectCode: text("project_code"), // Add project code column
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
  subcontractors: many(subcontractors), // Add relation to subcontractors
}));

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
  subcontractors: many(subcontractors), // Add relation to subcontractors
}));

export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  supplier: text("supplier").notNull(),
  expense_category: text("expense_category"),
  units: text("units"),
  volume: numeric("volume"),
  notes: text("notes"),
  date: date("date").notNull(),
  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade",
  }).notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});

export const subcontractors = pgTable("subcontractors", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  supplier: text("supplier").notNull(),
  expense_category: text("expense_category"),
  units: text("units"),
  volume: numeric("volume"),
  notes: text("notes"),
  date: date("date").notNull(),
  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade",
  }).notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const subcontractorsRelations = relations(subcontractors, ({ one }) => ({
  account: one(accounts, {
    fields: [subcontractors.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [subcontractors.categoryId],
    references: [categories.id],
  }),
}));

export const insertSubcontractorSchema = createInsertSchema(subcontractors, {
  date: z.coerce.date(),
});