import { type Decimal } from "@prisma/client/runtime/library";

export const dateToString = (date: Date) =>
  date.toLocaleDateString("sv-SE", {
    dateStyle: "short",
  });

export const toSek = (num: number) =>
  num.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    useGrouping: true,
  });

export const decimalToNumber = <T extends { belopp: Decimal; saldo: Decimal }>(
  tx: T,
) => ({
  ...tx,
  belopp: Number(tx.belopp),
  saldo: Number(tx.saldo),
});
