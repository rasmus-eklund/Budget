"use server";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { bankAccounts, persons } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import { and, eq, inArray } from "drizzle-orm";
import type { Name } from "~/types";
import { randomUUID } from "crypto";
import { notFound, redirect } from "next/navigation";

export const addBankAccount = async ({
  name,
  personId,
}: Name & { personId: string }) => {
  const userId = await getUserId();
  const person = await db.query.persons.findFirst({
    columns: { id: true },
    where: and(eq(persons.id, personId), eq(persons.userId, userId)),
  });
  if (!person) {
    throw new Error("Kunde inte lägga till bankkonto");
  }

  const [{ id }] = (await db
    .insert(bankAccounts)
    .values({ personId, name: name.toLowerCase(), id: randomUUID() })
    .returning({ id: bankAccounts.id })) as [{ id: string }];
  if (!id) {
    throw new Error("Kunde inte lägga till bankkonto");
  }
  revalidatePath(`/people/${personId}`);
};

const ownedAccountIds = (userId: string) =>
  db
    .select({ id: bankAccounts.id })
    .from(bankAccounts)
    .innerJoin(persons, eq(persons.id, bankAccounts.personId))
    .where(eq(persons.userId, userId));

export const renameBankAccount = async ({
  name,
  id,
}: Name & { id: string }) => {
  const userId = await getUserId();
  const res = await db
    .update(bankAccounts)
    .set({ name: name.toLowerCase() })
    .where(
      and(
        eq(bankAccounts.id, id),
        inArray(bankAccounts.id, ownedAccountIds(userId)),
      ),
    )
    .returning({ id: bankAccounts.id, personId: bankAccounts.personId });
  if (!res[0]) {
    throw new Error("Kunde inte byta bankkontots namn.");
  }
  revalidatePath(`/people/${res[0].personId}`);
};

export const removeBankAccount = async (formData: FormData) => {
  const userId = await getUserId();
  const id = formData.get("id") as string;
  const bankAccountId = formData.get("bankAccountId") as string;
  await db
    .delete(bankAccounts)
    .where(
      and(
        eq(bankAccounts.id, bankAccountId),
        inArray(bankAccounts.id, ownedAccountIds(userId)),
      ),
    );
  revalidatePath(`/people/${id}`);
};

export const addPerson = async ({ name: personName }: Name) => {
  const userId = await getUserId();
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
  const userId = await getUserId();
  await db
    .delete(persons)
    .where(and(eq(persons.id, id), eq(persons.userId, userId)));
  revalidatePath("/people");
};

export const renamePerson = async ({ name, id }: Name & { id: string }) => {
  const userId = await getUserId();
  const res = await db
    .update(persons)
    .set({ name: name.toLowerCase() })
    .where(and(eq(persons.id, id), eq(persons.userId, userId)))
    .returning({ id: persons.id });
  if (!res[0]) {
    throw new Error("Kunde inte ändra personens namn");
  }
  revalidatePath(`/people/${res[0].id}`);
};

export const getAllPeople = async () => {
  const userId = await getUserId();
  return await db
    .select({ id: persons.id, name: persons.name })
    .from(persons)
    .where(eq(persons.userId, userId));
};

export const getBankAccounts = async (id: string) => {
  const userId = await getUserId();
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
