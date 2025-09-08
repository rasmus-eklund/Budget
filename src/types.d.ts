export type TxFilter = {
  category: string[];
  person: string[];
  account: string[];
  search: string;
};

type SortOption = "date-asc" | "date-desc" | "amount-asc" | "amount-desc";
type TxSort = { sort: SortOption };

type Tab = "aggregated" | "transactions" | "categoryBars" | "balanceOverTime";

export type Internal = {
  id: string;
  belopp: number;
  typ: string;
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
  typ: string;
  budgetgrupp: string;
  belopp: number;
  saldo: number;
  konto: string;
  person: string;
};

export type Name = { name: string };
