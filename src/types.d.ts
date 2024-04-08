export type TxFilter = {
  category: string;
  person: string;
  account: string;
  inom: boolean;
  search: string;
};

type TxSort = { belopp: tOption };

export type Internal = {
  id: string;
  belopp: number;
  typ: Typ;
  konto: string;
  person: string;
};

export type DbTx = { id: string; year: number; date: Date; data: string };

export type Uniques = {
  people: string[];
  categories: string[];
  accounts: string[];
};

export type TxReturn = {
  success: boolean;
  data: Tx[];
  message: "Success" | "Något gick fel" | "Fel lösenord";
};
