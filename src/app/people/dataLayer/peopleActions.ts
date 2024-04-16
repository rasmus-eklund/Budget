"use server";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { bankAccounts, persons } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import { and, eq } from "drizzle-orm";
import { type Name } from "~/lib/zodSchemas";
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
  revalidatePath(`/people/${name}`);
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
  revalidatePath(`/people/${name}`);
};

export const removeBankAccount = async (formData: FormData) => {
  await getUserId();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
  revalidatePath(`/people/${name}`);
};

export const addPerson = async ({ name: personName }: Name) => {
  const userId = await getUserId();
  const [{ name }] = (await db
    .insert(persons)
    .values({ name: personName.toLowerCase(), id: randomUUID(), userId })
    .returning({ name: persons.name })) as [{ name: string }];
  if (!name) {
    throw new Error("Kunde inte lägga till person");
  }
  redirect(`/people/${name}`);
};

export const removePerson = async (formData: FormData) => {
  const userId = await getUserId();
  const id = formData.get("id") as string;
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
  revalidatePath(`/people/${name}`);
};

export const getAllPeople = async () => {
  const userId = await getUserId();
  return await db
    .select({ id: persons.id, name: persons.name })
    .from(persons)
    .where(eq(persons.userId, userId));
};

export const getBankAccounts = async ({ name }: { name: string }) => {
  const userId = await getUserId();
  const person = await db.query.persons.findFirst({
    columns: { name: true, id: true },
    where: and(eq(persons.name, name), eq(persons.userId, userId)),
    with: { bankAccounts: { columns: { id: true, name: true } } },
  });
  if (!person) {
    notFound();
  }

  return person;
};
