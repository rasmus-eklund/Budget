import type { Tx } from "~/types";

const calculateSums = ({
  data,
  category,
  person,
}: {
  data: Tx[];
  category: string[];
  person: string[];
}) => {
  const sums: Record<string, Record<string, number>> = {};
  for (const cat of category) {
    sums[cat] = { total: 0 };
    for (const p of person) {
      sums[cat][p] = 0;
    }
  }
  for (const { budgetgrupp, person, belopp } of data) {
    if (budgetgrupp !== "inom") {
      if (sums[budgetgrupp] !== undefined) {
        if (sums[budgetgrupp][person] !== undefined) {
          sums[budgetgrupp][person] += belopp;
        }
      }
    }
  }
  for (const cat of category) {
    sums[cat]!.total = Object.keys(sums[cat]!).reduce(
      (acc, person) => (acc += sums[cat]![person]!),
      0,
    );
  }
  const total: Record<string, number> = {};
  const spending: Record<string, number> = {};
  for (const p of person) {
    total[p] = category.reduce(
      (acc, category) => (acc += sums[category]![p]!),
      0,
    );
    spending[p] = category.reduce((acc, category) => {
      const value = sums[category]![p]!;
      acc += value < 0 ? value : 0;
      return acc;
    }, 0);
  }
  total.total = Object.keys(total).reduce(
    (acc, person) => (acc += total[person]!),
    0,
  );
  spending.total = Object.keys(spending).reduce(
    (acc, person) => (acc += spending[person]!),
    0,
  );
  sums.spending = spending;
  sums.total = total;
  return sums;
};

export default calculateSums;
