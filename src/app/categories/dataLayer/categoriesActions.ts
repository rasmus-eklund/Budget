"use server";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { category, match } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import { and, eq } from "drizzle-orm";
import { type Name } from "~/lib/zodSchemas";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

export const addMatch = async ({
  name,
  categoryId,
}: Name & { categoryId: string }) => {
  const userId = await getUserId();
  await db.insert(match).values({ categoryId, name, id: randomUUID(), userId });
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
  const id = randomUUID();
  await db.insert(category).values({ name: name.toLowerCase(), id, userId });
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
  const name = await db.query.category.findFirst({
    where: and(eq(category.id, categoryId), eq(category.userId, userId)),
  });
  const unique = await db
    .select({ name: match.name })
    .from(match)
    .where(eq(match.userId, userId));
  if (!name) {
    throw new Error("Not found");
  }
  const matches = await db
    .select({ id: match.id, name: match.name })
    .from(match)
    .where(and(eq(match.categoryId, categoryId), eq(match.userId, userId)));

  return { name: name.name, matches, unique };
};
