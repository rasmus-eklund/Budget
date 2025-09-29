import type { FileData } from "~/types";

export const colors = [
  "#FF0000",
  "#FFCC00",
  "#FF6633",
  "#FF9966",
  "#FF3300",
  "#FFCC99",
  "#FF3333",
  "#FF6600",
  "#FFCC99",
  "#FF3333",
];

export const months = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

export const emptyOptions = {
  category: { inkomst: true, övrigt: true, inom: false },
  person: {},
  account: {},
  search: "",
};

export const sortOptions = {
  amountAsc: "amount-asc",
  amountDesc: "amount-desc",
  dateAsc: "date-asc",
  dateDesc: "date-desc",
} as const;

export const configs: FileData["config"][] = [
  {
    name: "ICA",
    skipLines: 0,
    columns: {
      Datum: "datum",
      Text: "text",
      Belopp: "belopp",
      Saldo: "saldo",
    },
  },
  {
    name: "Handelsbanken",
    skipLines: 8,
    columns: {
      Transaktionsdatum: "datum",
      Text: "text",
      Belopp: "belopp",
      Saldo: "saldo",
    },
  },
  {
    name: "Swedbank",
    skipLines: 1,
    columns: {
      Transaktionsdag: "datum",
      Beskrivning: "text",
      Belopp: "belopp",
      "Bokfört saldo": "saldo",
    },
  },
] as const;
