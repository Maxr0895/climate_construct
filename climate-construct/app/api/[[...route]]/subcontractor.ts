import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { parse, subDays } from "date-fns";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2"

import { 
  subcontractors, 
  insertSubcontractorSchema, 
  categories,
  accounts
} from "@/db/schema";


const app = new Hono()
  .get(
    "/",
   zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),

    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }


      const data = await db
        .select({
          id: subcontractors.id,
          date: subcontractors.date,
          categoryId: subcontractors.categoryId,
          category: categories.name,
          supplier: subcontractors.supplier,
          amount: subcontractors.amount,
          notes: subcontractors.notes,
          accountId: subcontractors.accountId,
          account: accounts.name,
          expense_category: subcontractors.expense_category,
          units: subcontractors.units,
          volume: subcontractors.volume,
        })
        .from(subcontractors)
        .innerJoin(accounts, eq(subcontractors.accountId, accounts.id))
        .leftJoin(categories, eq(subcontractors.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(subcontractors.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
          )
        )
        .orderBy(desc(subcontractors.date));

      return c.json({ data });
  })
 .get(
    "/:id",
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: subcontractors.id,
          date: subcontractors.date,
          categoryId: subcontractors.categoryId,
          supplier: subcontractors.supplier,
          amount: subcontractors.amount,
          notes: subcontractors.notes,
          accountId: subcontractors.accountId,
          account: accounts.name,
          expense_category: subcontractors.expense_category,
          units: subcontractors.units,
          volume: subcontractors.volume,
        })
        .from(subcontractors)
        .innerJoin(accounts, eq(subcontractors.accountId, accounts.id))
        .where(
          and(
            eq(subcontractors.id, id),
            eq(accounts.userId, auth.userId),
          ),
        );
      
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
   .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertSubcontractorSchema.omit({
      id: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }


     const [data] = await db.insert(subcontractors).values({
  id: createId(),
  ...values,
  date: values.date.toISOString().split('T')[0],
}).returning();

return c.json({ data });
  })
 .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertSubcontractorSchema.omit({
          id: true,
        }),
      ),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

   const data = await db
  .insert(subcontractors)
  .values(
    values.map((value) => ({
      id: createId(),
      ...value,
      date: value.date.toISOString().split('T')[0],
    }))
  )
  .returning();
        
      return c.json({ data });
    },
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const subcontractorsToDelete = db.$with("subcontractors_to_delete").as(
        db.select({ id: subcontractors.id }).from(subcontractors)
          .innerJoin(accounts, eq(subcontractors.accountId, accounts.id))
          .where(and(
            inArray(subcontractors.id, values.ids),
            eq(accounts.userId, auth.userId),
          )),
      );

      const data = await db
        .with(subcontractorsToDelete)
        .delete(subcontractors)
        .where(
          inArray(subcontractors.id, sql`(select id from ${subcontractorsToDelete})`)
        )
        .returning({
          id: subcontractors.id,
        });

      return c.json({ data });
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertSubcontractorSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const subcontractorsToUpdate = db.$with("subcontractors_to_update").as(
        db.select({ id: subcontractors.id })
          .from(subcontractors)
          .innerJoin(accounts, eq(subcontractors.accountId, accounts.id))
          .where(and(
            eq(subcontractors.id, id),
            eq(accounts.userId, auth.userId),
          )),
      );

     const [data] = await db
  .with(subcontractorsToUpdate)
  .update(subcontractors)
  .set({
    ...values,
    date: values.date.toISOString().split('T')[0],
  })
  .where(
    inArray(subcontractors.id, sql`(select id from ${subcontractorsToUpdate})`)
  )
  .returning();
        

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  )
.delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const subcontractorsToDelete = db.$with("subcontractors_to_delete").as(
        db.select({ id: subcontractors.id })
          .from(subcontractors)
          .innerJoin(accounts, eq(subcontractors.accountId, accounts.id))
          .where(and(
            eq(subcontractors.id, id),
            eq(accounts.userId, auth.userId),
          )),
      );

      const [data] = await db
        .with(subcontractorsToDelete)
        .delete(subcontractors)
        .where(
          inArray(
            subcontractors.id,
            sql`(select id from ${subcontractorsToDelete})`
          ),
        )
        .returning({
          id: subcontractors.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  );


export default app