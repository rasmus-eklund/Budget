const types = [
  "Insättning",
  "Korttransaktion",
  "Övrigt",
  "Uttag",
  "Autogiro",
  "Pg-bg",
  "E-faktura",
  "Pg-Bg",
  "Utlandsbetalning",
] as const;

export type Typ = (typeof types)[number];

export type TxFilter = {
  category: string;
  person: string;
  inom: boolean;
};

export type Internal = { id: string; belopp: number; typ: Typ; konto: string };
