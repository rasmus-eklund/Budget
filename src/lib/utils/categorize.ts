import { type Category } from "~/types";
import { type Tx } from "../zodSchemas";

export const categorize = (text: string, categories: Category[]) => {
  for (const { name, match } of categories) {
    for (const m of match) {
      const regex = new RegExp(m.name.replace(/\*/g, ".*"), "i");
      if (regex.test(text)) {
        return name;
      }
    }
  }
  return null;
};

export const applyCategory = ({
  tx,
  categories,
}: {
  tx: Tx;
  categories: Category[];
}) => {
  if (tx.budgetgrupp === "inom") {
    return tx;
  }
  if (tx.belopp > 0) {
    return { ...tx, budgetgrupp: "inkomst" };
  }
  return {
    ...tx,
    budgetgrupp: categorize(tx.text, categories) ?? tx.budgetgrupp,
  };
};
