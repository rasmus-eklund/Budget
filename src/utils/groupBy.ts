import { type Tx } from "~/zodSchemas";

const groupBy = (list: Tx[]) => {
  return list.reduce(
    (p, c) => {
      const group = c.budgetgrupp;
      if (!p[group]) {
        p[group] = [];
      }
      p[group]!.push(c);
      return p;
    },
    {} as Record<string, Tx[]>,
  );
};

export default groupBy;
