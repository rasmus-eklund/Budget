import { type Tx } from "../zodSchemas";

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
    sums[category] = {};
    for (const person of people) {
      sums[category]![person] = 0;
    }
    sums[category]!.total = 0;
  }
  for (const { budgetgrupp, person, belopp } of data) {
    if (budgetgrupp !== "inom") {
      sums[budgetgrupp]![person] += belopp;
    }
  }
  for (const category of categories) {
    sums[category]!.total = Object.keys(sums[category]!).reduce(
      (acc, person) => (acc += sums[category]![person]!),
      0,
    );
  }
  const total: Record<string, number> = {};
  for (const person of people) {
    total[person] = categories.reduce(
      (acc, category) => (acc += sums[category]![person]!),
      0,
    );
  }
  total.total = Object.keys(total).reduce(
    (acc, person) => (acc += total[person]!),
    0,
  );
  sums.total = total;
  return sums;
};

export default calculateSums;
