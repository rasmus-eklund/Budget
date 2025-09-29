import type { Tx, Uniques } from "~/types";

export const getUnique = (data: Tx[]): Uniques => {
  const { person, account, category } = getDefaultOptions(data);
  return {
    person: [...person].sort(),
    account: [...account],
    category: reorder([...category]),
  };
};

export const getDefaultOptions = (data: Tx[]) => {
  const person = new Set<string>();
  const account = new Set<string>();
  const category = new Set<string>();

  for (const tx of data) {
    if (!person.has(tx.person)) person.add(tx.person);
    if (!account.has(tx.konto)) account.add(tx.konto);
    if (!category.has(tx.budgetgrupp)) category.add(tx.budgetgrupp);
  }
  return { person, account, category };
};

const reorder = (arr: string[]): string[] => [
  ...arr.filter((v) => v === "inkomst"),
  ...arr.filter((v) => v !== "inkomst" && v !== "övrigt"),
  ...arr.filter((v) => v === "övrigt"),
];
export default getUnique;
