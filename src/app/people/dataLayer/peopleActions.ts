"use server";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { bankAccounts, persons } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import { and, eq } from "drizzle-orm";
import type { Name } from "~/types";
import { randomUUID } from "crypto";
import { notFound, redirect } from "next/navigation";

export const addBankAccount = async ({
  name,
  personId,
}: Name & { personId: string }) => {
  await getUserId();
  const [{ id }] = (await db
    .insert(bankAccounts)
    .values({ personId, name: name.toLowerCase(), id: randomUUID() })
    .returning({ id: bankAccounts.id })) as [{ id: string }];
  if (!id) {
    throw new Error("Kunde inte lägga till bankkonto");
  }
  revalidatePath(`/people/${id}`);
};

export const renameBankAccount = async ({
  name,
  id,
}: Name & { id: string }) => {
  await getUserId();
  const [{ id: newId }] = (await db
    .update(bankAccounts)
    .set({ name: name.toLowerCase() })
    .where(eq(bankAccounts.id, id))
    .returning({ id: bankAccounts.id })) as [{ id: string }];
  if (!newId) {
    throw new Error("Kunde inte byta bankkontots namn.");
  }
  revalidatePath(`/people/${newId}`);
};

export const removeBankAccount = async (formData: FormData) => {
  await getUserId();
  const id = formData.get("id") as string;
  const bankAccountId = formData.get("bankAccountId") as string;
  await db.delete(bankAccounts).where(eq(bankAccounts.id, bankAccountId));
  revalidatePath(`/people/${id}`);
};

export const addPerson = async ({
  name: personName,
  userId,
}: Name & { userId: string }) => {
  const [{ id }] = (await db
    .insert(persons)
    .values({ name: personName.toLowerCase(), id: randomUUID(), userId })
    .returning({ id: persons.id })) as [{ id: string }];
  if (!id) {
    throw new Error("Kunde inte lägga till person");
  }
  redirect(`/people/${id}`);
};

export const removePerson = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const userId = formData.get("userId") as string;
  await db
    .delete(persons)
    .where(and(eq(persons.id, id), eq(persons.userId, userId)));
  revalidatePath("/people");
};

export const renamePerson = async ({ name, id }: Name & { id: string }) => {
  await getUserId();
  const [{ id: newId }] = (await db
    .update(persons)
    .set({ name: name.toLowerCase() })
    .where(eq(persons.id, id))
    .returning({ id: persons.id })) as [{ id: string }];
  if (!newId) {
    throw new Error("Kunde inte ändra personens namn");
  }
  revalidatePath(`/people/${newId}`);
};

export const getAllPeople = async (userId: string) => {
  return await db
    .select({ id: persons.id, name: persons.name })
    .from(persons)
    .where(eq(persons.userId, userId));
};

export const getBankAccounts = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const person = await db.query.persons.findFirst({
    columns: { name: true, id: true },
    where: and(eq(persons.id, id), eq(persons.userId, userId)),
    with: { bankAccounts: { columns: { id: true, name: true } } },
  });
  if (!person) {
    notFound();
  }

  return person;
};
