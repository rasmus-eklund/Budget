"use server";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { category, match } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import { and, eq } from "drizzle-orm";
import type { JsonData, Name } from "~/lib/zodSchemas";
import { randomUUID } from "crypto";
import { notFound, redirect } from "next/navigation";

export const addMatch = async ({
  name,
  categoryId,
}: Name & { categoryId: string }) => {
  await getUserId();
  await db
    .insert(match)
    .values({ categoryId, name, id: randomUUID() })
    .returning({ categoryId: match.categoryId });

  revalidatePath(`/categories/${categoryId}`);
};

export const removeMatch = async (formData: FormData) => {
  await getUserId();
  const id = formData.get("id") as string;
  const categoryId = formData.get("budgetgruppId") as string;
  await db.delete(match).where(eq(match.id, id));
  revalidatePath(`/categories/${categoryId}`);
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
  const userId = await getUserId();
  const id = formData.get("id") as string;
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

export const getMatches = async ({ categoryId }: { categoryId: string }) => {
  const userId = await getUserId();
  const cat = await db.query.category.findFirst({
    columns: { name: true },
    where: and(eq(category.id, categoryId), eq(category.userId, userId)),
    with: { match: { columns: { id: true, name: true } } },
  });
  if (!cat) {
    notFound();
  }
  const unique = await db.query.match.findMany({
    columns: { name: true },
    where: eq(category.userId, userId),
  });

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

export const replaceAllMatches = async (data: JsonData) => {
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
      tx.rollback();
    }
  });
  revalidatePath("/categories");
};
