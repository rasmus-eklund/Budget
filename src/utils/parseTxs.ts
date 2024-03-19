import { randomUUID } from "crypto";
import { parse } from "csv-parse";
import { type Tx, type Typ, txSchema } from "~/zodSchemas";

const parseTxs = async (buffer: Buffer, person: string, konto: string) => {
  const tmp: Tx[] = [];
  await parse(buffer, { delimiter: ";", from_line: 2 }).forEach(
    (row: [string, string, Typ, string, string, string]) => {
      const [date, text, typ, _, bel, sal] = row;
      const datum = new Date(date);
      const belopp = Number(
        bel.replace("kr", "").replace(",", ".").replace(" ", ""),
      );
      const saldo = Number(
        sal.replace("kr", "").replace(",", ".").replace(" ", ""),
      );
      const tx: Tx = {
        id: randomUUID(),
        datum,
        text,
        typ,
        budgetgrupp: "övrigt",
        belopp,
        saldo,
        person,
        konto,
        index: 0,
      };
      const parsed = txSchema.safeParse(tx);
      if (!parsed.success) {
        throw new Error(parsed.error.message);
      }
      tmp.push(parsed.data);
    },
  );
  const tmpData = [...tmp.reverse().map((i, index) => ({ ...i, index }))];
  const reserved = tmpData.filter(({ typ }) => typ === "Reserverat Belopp");
  if (!!reserved) {
    reserved.forEach(({ belopp, index, datum }) => {
      const prev = tmpData[index - 1];
      if (!prev) {
        throw new Error(
          `Cannot iterpolate reserved for date: ${datum.toLocaleTimeString(
            "sv-SE",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            },
          )}, index: ${index}`,
        );
      }
      tmpData[index]!.saldo = prev.saldo + belopp;
    });
  }
  return tmpData;
};

export default parseTxs;
