export type TxFilter = {
  category: string;
  person: string;
  inom: boolean;
};

export type Internal = {
  id: string;
  belopp: number;
  typ: Typ;
  konto: string;
  person: string;
};
