const getUnique = <
  T extends { person: string; budgetgrupp: string; konto: string },
>(
  data: T[],
) => {
  const people = new Set<string>();
  const categoriesSet = new Set<string>();
  const accounts = new Set<string>();

  data.forEach(({ person, budgetgrupp, konto }) => {
    people.add(person);
    categoriesSet.add(budgetgrupp);
    accounts.add(konto);
  });
  const categories: string[] = [];
  const otherCategories: string[] = [];
  const rest: string[] = [];

  categoriesSet.forEach((category) => {
    if (category === "inkomst") {
      categories.push(category);
    } else if (category === "övrigt") {
      otherCategories.push(category);
    } else {
      rest.push(category);
    }
  });

  categories.push(...rest.sort());
  categories.push(...otherCategories);

  return {
    people: [...people].sort(),
    categories,
    accounts: [...accounts],
  };
};

export default getUnique;
