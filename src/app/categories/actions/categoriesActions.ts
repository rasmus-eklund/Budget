"use server";
import { db } from "~/server/db";

import { revalidatePath } from "next/cache";
import { category, match } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

export const addMatch = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const categoryId = formData.get("budgetgruppId") as string;
  await db.insert(match).values({ categoryId, name, id: randomUUID() });
  revalidatePath(`/categories/${categoryId}`);
};

export const removeMatch = async (formData: FormData) => {
  await getUserId();
  const id = formData.get("id") as string;
  const categoryId = formData.get("budgetgruppId") as string;
  await db.delete(match).where(eq(match.id, id));
  revalidatePath(`/categories/${categoryId}`);
};

export const addCategory = async (formData: FormData) => {
  const userId = await getUserId();
  const name = formData.get("name") as string;
  await db.insert(category).values({ name, userId, id: randomUUID() });
  revalidatePath("/categories");
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
  const data = await db.query.category.findFirst({
    where: and(eq(category.id, categoryId), eq(category.userId, userId)),
    with: { matches: true },
  });
  if (!data) {
    throw new Error("Not found");
  }
  return data;
};
