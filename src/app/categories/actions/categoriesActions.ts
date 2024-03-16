"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export const addMatch = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const budgetgruppId = formData.get("budgetgruppId") as string;
  await api.matches.create.mutate({ budgetgruppId, name });
  revalidatePath(`/categories/${budgetgruppId}`);
};

export const removeMatch = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const budgetgruppId = formData.get("budgetgruppId") as string;
  await api.matches.delete.mutate({ id });
  revalidatePath(`/categories/${budgetgruppId}`);
};

export const addCategory = async (formData: FormData) => {
  const name = formData.get("name") as string;
  await api.categories.create.mutate({ name });
  revalidatePath("/categories");
};

export const removeCategory = async (formData: FormData) => {
  const id = formData.get("id") as string;
  await api.categories.delete.mutate({ id });
  revalidatePath("/categories");
};
