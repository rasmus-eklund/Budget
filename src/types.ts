export type SortOption =
  | "date-asc"
  | "date-desc"
  | "amount-asc"
  | "amount-desc";
export type TxSort = { sort: SortOption };

export type FilterTab =
  | "aggregated"
  | "transactions"
  | "categoryBars"
  | "balanceOverTime";

export type DateTab = "month" | "day" | "year" | "free";

export type Internal = {
  id: string;
  belopp: number;
  bankAccountId: string;
};

export type Uniques = {
  person: string[];
  category: string[];
  account: string[];
};

export type FilterItem = Record<string, boolean>;

export type Filter = {
  person: FilterItem;
  account: FilterItem;
  category: FilterItem;
  search: string;
};

export type TxReturn =
  | {
      ok: true;
      data: Tx[];
      options: Filter;
    }
  | { ok: false };

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
  config: { name: string; skipLines: number; columns: Record<string, string> };
};

export type Tx = {
  id: string;
  datum: Date;
  text: string;
  budgetgrupp: string;
  belopp: number;
  saldo: number;
  konto: string;
  person: string;
};

export type Name = { name: string };
