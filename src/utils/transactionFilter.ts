import { type TxFilter } from "~/types";

const transactionFilter = <
  T extends { person: string; budgetgrupp: string; filter: TxFilter },
>({
  person,
  budgetgrupp,
  filter,
}: T) => {
  const personMatch = filter.person === "" || person === filter.person;
  const categoryMatch =
    filter.category === "" || budgetgrupp === filter.category;
  const inomMatch = filter.inom || budgetgrupp !== "inom";
  return personMatch && categoryMatch && inomMatch;
};

export default transactionFilter;
