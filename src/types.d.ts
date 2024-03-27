export type TxFilter = {
  category: string;
  person: string;
  account: string;
  inom: boolean;
};

type TxSort = { belopp: tOption };

export type Internal = {
  id: string;
  belopp: number;
  typ: Typ;
  konto: string;
  person: string;
};

export type DbTx = { year: number; date: Date; data: string };
