import { type TxFilter } from "~/types";

const transactionFilter = <
  T extends {
    person: string;
    budgetgrupp: string;
    konto: string;
    filter: TxFilter;
  },
>({
  konto,
  person,
  budgetgrupp,
  filter,
}: T) => {
  const personMatch = filter.person === "" || person === filter.person;
  const categoryMatch =
    filter.category === "" || budgetgrupp === filter.category;
  const accountMatch = filter.account === "" || konto === filter.account;
  const inomMatch = filter.inom || budgetgrupp !== "inom";
  return personMatch && categoryMatch && accountMatch && inomMatch;
};

export default transactionFilter;
