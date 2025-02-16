import type { types } from "~/lib/constants/types";
export type Typ = (typeof types)[number];

export type TxFilter = {
  category: string;
  person: string;
  account: string;
  inom: boolean;
  search: string;
};

type SortOption = "date-asc" | "date-desc" | "amount-asc" | "amount-desc";
type TxSort = { sort: SortOption };

type Tab = "aggregated" | "transactions" | "categoryBars" | "balanceOverTime";

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

export type TxReturn =
  | {
      ok: true;
      data: Tx[];
    }
  | { ok: false; error: "password" | "error" };

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
  typ: Typ;
  budgetgrupp: string;
  belopp: number;
  saldo: number;
  konto: string;
  person: string;
};
