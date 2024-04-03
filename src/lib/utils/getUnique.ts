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

  categoriesSet.forEach((category) => {
    if (category === "inkomst") {
      categories.unshift(category);
    } else if (category === "övrigt") {
      categories.push(category);
    } else {
      otherCategories.push(category);
    }
  });

  categories.push(...otherCategories.sort());

  return {
    people: [...people].sort(),
    categories,
    accounts: [...accounts],
  };
};

export default getUnique;
