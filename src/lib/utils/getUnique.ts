import { type TxFilter } from "~/types";

const getUnique = <
  T extends { person: string; budgetgrupp: string; konto: string },
>({
  data,
  txFilter: filter,
}: {
  data: T[];
  txFilter: TxFilter;
}) => {
  const people = new Set<string>();
  const categoriesSet = new Set<string>();
  const accounts = new Set<string>();
  const allCategoriesSet = new Set<string>();
  const allAccounts = new Set<string>();

  for (const { person, budgetgrupp, konto } of data) {
    if (!people.has(person)) people.add(person);
    if (!allAccounts.has(konto)) allAccounts.add(konto);
    if (!allCategoriesSet.has(budgetgrupp)) allCategoriesSet.add(budgetgrupp);
    if (filter.person.includes(person)) {
      if (filter.account.includes(konto)) {
        categoriesSet.add(budgetgrupp);
      }
      if (filter.category.includes(budgetgrupp)) {
        accounts.add(konto);
      }
    }
  }

  const categories: string[] = [];
  const otherCategories: string[] = [];
  const rest: string[] = [];
  const allCategories: string[] = [];
  const allOtherCategories: string[] = [];
  const allRest: string[] = [];

  for (const category of categoriesSet) {
    if (category === "inkomst") {
      categories.push(category);
    } else if (category === "övrigt") {
      otherCategories.push(category);
    } else {
      rest.push(category);
    }
  }
  for (const category of allCategoriesSet) {
    if (category === "inkomst") {
      allCategories.push(category);
    } else if (category === "övrigt") {
      allOtherCategories.push(category);
    } else {
      allRest.push(category);
    }
  }

  categories.push(...rest.sort());
  categories.push(...otherCategories);
  allCategories.push(...allRest.sort());
  allCategories.push(...allOtherCategories);
  const peopleSorted = [...people].sort();
  return {
    transactions: {
      people: peopleSorted,
      categories,
      accounts: [...accounts],
    },
    aggregated: {
      people: peopleSorted,
      categories: [...allCategories],
      accounts: [...allAccounts],
    },
  };
};

export default getUnique;
