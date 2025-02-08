import type { Tx } from "./lib/zodSchemas";

export type TxFilter = {
  category: string;
  person: string;
  account: string;
  inom: boolean;
  search: string;
};

type SortOption = "date-asc" | "date-desc" | "amount-asc" | "amount-desc";
type TxSort = { sort: SortOption };

export type Internal = {
  id: string;
  belopp: number;
  typ: Typ;
  bankAccountId: string;
};

export type Uniques = {
  people: string[];
  categories: string[];
  accounts: string[];
};

export type TxReturn = {
  data: Tx[];
  status: "Success" | "Error" | "Wrong password";
};

export type Category = { name: string; match: { name: string }[] };
export type PersonAccounts = {
  id: string;
  name: string;
  bankAccounts: {
    id: string;
    name: string;
  }[];
}[];

export type FileData = {
  bankAccountId: string;
  file: File;
};

export type Tx = {
  id: string;
  datum: Date;
  text: string;
  typ: keyof typeof types;
  budgetgrupp: string;
  belopp: number;
  saldo: number;
  konto: string;
  person: string;
}
