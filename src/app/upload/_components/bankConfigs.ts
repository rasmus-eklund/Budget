import type { FileData } from "~/types";

const configs: FileData["config"][] = [
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

export default configs;
