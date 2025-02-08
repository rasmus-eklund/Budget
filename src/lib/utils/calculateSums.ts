import type { Tx } from "~/types";

const calculateSums = ({
  data,
  categories,
  people,
}: {
  data: Tx[];
  categories: string[];
  people: string[];
}) => {
  const sums: Record<string, Record<string, number>> = {};
  for (const category of categories) {
    sums[category] = { total: 0 };
    for (const person of people) {
      sums[category]![person] = 0;
    }
  }
  for (const { budgetgrupp, person, belopp } of data) {
    if (budgetgrupp !== "inom") {
      if (sums[budgetgrupp] !== undefined) {
        if (sums[budgetgrupp][person] !== undefined) {
          sums[budgetgrupp]![person] += belopp;
        }
      }
    }
  }
  for (const category of categories) {
    sums[category]!.total = Object.keys(sums[category]!).reduce(
      (acc, person) => (acc += sums[category]![person]!),
      0,
    );
  }
  const total: Record<string, number> = {};
  const spending: Record<string, number> = {};
  for (const person of people) {
    total[person] = categories.reduce(
      (acc, category) => (acc += sums[category]![person]!),
      0,
    );
    spending[person] = categories.reduce((acc, category) => {
      const value = sums[category]![person]!;
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
