"use server";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { category, match } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import { and, eq, inArray } from "drizzle-orm";
import type { JsonData } from "~/lib/zodSchemas";
import { randomUUID } from "crypto";
import { notFound, redirect } from "next/navigation";
import type { Name } from "~/types";

const ownedCategoryIds = (userId: string) =>
  db
    .select({ id: category.id })
    .from(category)
    .where(eq(category.userId, userId));

export const addMatch = async ({
  name,
  categoryId,
}: Name & { categoryId: string }) => {
  const userId = await getUserId();
  const cat = await db.query.category.findFirst({
    columns: { id: true },
    where: and(eq(category.id, categoryId), eq(category.userId, userId)),
  });
  if (!cat) {
    throw new Error("Kunde inte lägga till matchning");
  }

  const res = await db
    .insert(match)
    .values({ categoryId, name, id: randomUUID() })
    .returning({ categoryId: match.categoryId });
  if (!res[0]) {
    throw new Error("Kunde inte lägga till matchning");
  }
  revalidatePath(`/categories/${res[0].categoryId}`);
};

export const removeMatch = async (formData: FormData) => {
  const userId = await getUserId();
  const id = formData.get("id") as string;
  const deleted = await db
    .delete(match)
    .where(
      and(
        eq(match.id, id),
        inArray(match.categoryId, ownedCategoryIds(userId)),
      ),
    )
    .returning({ categoryId: match.categoryId });
  if (!deleted[0]) {
    throw new Error("Kunde inte ta bort matchning");
  }
  revalidatePath(`/categories/${deleted[0].categoryId}`);
};

export const renameMatch = async ({ name, id }: Name & { id: string }) => {
  const userId = await getUserId();
  const res = await db
    .update(match)
    .set({ name: name.toLowerCase() })
    .where(
      and(
        eq(match.id, id),
        inArray(match.categoryId, ownedCategoryIds(userId)),
      ),
    )
    .returning({ id: match.id, categoryId: match.categoryId });
  if (!res[0]) {
    throw new Error("Kunde inte ändra matchningens namn");
  }
  revalidatePath(`/categories/${res[0].categoryId}`);
};

export const getMatches = async (categoryId: string) => {
  const userId = await getUserId();
  const cat = await db.query.category.findFirst({
    columns: { name: true },
    where: and(eq(category.id, categoryId), eq(category.userId, userId)),
    with: { match: { columns: { id: true, name: true } } },
  });
  if (!cat) {
    notFound();
  }
  const cats = await db.query.category.findMany({
    with: { match: { columns: { name: true } } },
    where: eq(category.userId, userId),
  });
  const unique = cats.flatMap((c) => c.match.map((m) => m.name));
  return { ...cat, unique };
};

export const getAllMatches = async () => {
  const userId = await getUserId();
  return await db.query.category.findMany({
    columns: { name: true },
    with: { match: { columns: { name: true } } },
    where: eq(category.userId, userId),
  });
};

export const replaceAllMatches = async ({ data }: { data: JsonData }) => {
  const userId = await getUserId();
  await db.transaction(async (tx) => {
    try {
      await tx.delete(category).where(eq(category.userId, userId));
      const values = data.map((cat) => ({
        name: cat.name.toLowerCase(),
        id: randomUUID(),
        userId,
      }));
      const categories = await tx
        .insert(category)
        .values(values)
        .returning({ id: category.id, name: category.name });
      const matchValues = categories.flatMap((cat) => {
        const category = data.find((i) => i.name === cat.name);
        if (!category) {
          throw new Error("Något gick fel");
        }
        return category.match.map(({ name }) => ({
          categoryId: cat.id,
          name,
          id: randomUUID(),
        }));
      });
      await tx.insert(match).values(matchValues);
    } catch (error) {
      console.error(error);
      tx.rollback();
    }
  });
  revalidatePath("/categories");
};

export const addCategory = async ({ name }: Name) => {
  const userId = await getUserId();
  const [{ id }] = (await db
    .insert(category)
    .values({ name: name.toLowerCase(), id: randomUUID(), userId })
    .returning({ id: category.id })) as [{ id: string }];
  if (!id) {
    throw new Error("Kunde inte lägga till kategori");
  }
  redirect(`/categories/${id}`);
};

export const removeCategory = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const userId = await getUserId();
  await db
    .delete(category)
    .where(and(eq(category.id, id), eq(category.userId, userId)));
  revalidatePath("/categories");
};

export const getAllCategories = async () => {
  const userId = await getUserId();
  return await db
    .select({ id: category.id, name: category.name })
    .from(category)
    .where(eq(category.userId, userId));
};

export const renameCategory = async ({ name, id }: Name & { id: string }) => {
  const userId = await getUserId();
  const res = await db
    .update(category)
    .set({ name: name.toLowerCase() })
    .where(and(eq(category.id, id), eq(category.userId, userId)))
    .returning({ id: category.id });
  if (!res[0]) {
    throw new Error("Kunde inte ändra kategorins namn");
  }
  revalidatePath("/categories");
};
