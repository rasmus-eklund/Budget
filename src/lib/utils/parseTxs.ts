import { parse } from "papaparse";
import {
  type TxBankAccount,
  csvSchema,
  csvColumnsSchema,
} from "~/lib/zodSchemas";
import { v4 as uuid } from "uuid";

const parseTxs = async (buffer: Buffer, bankAccountId: string) => {
  const decoder = new TextDecoder("utf-8");
  const csvString = decoder.decode(buffer);

  return new Promise<TxBankAccount[]>((resolve, reject) => {
    parse(csvString, {
      delimiter: ";",
      header: false,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0)
          return reject("Kunde inte läsa CSV filen.");
        const tmp: TxBankAccount[] = [];
        const [columns, ...rows] = result.data;

        const parsedColumns = csvColumnsSchema.safeParse(columns);
        if (!parsedColumns.success) {
          return reject(parsedColumns.error);
        }

        for (const row of rows) {
          const [datum, text, typ, , belopp, saldo] = row as string[];
          const parsed = csvSchema.safeParse({
            id: uuid(),
            datum,
            text,
            typ,
            budgetgrupp: "övrigt",
            belopp,
            saldo,
            bankAccountId,
          });
          if (!parsed.success) {
            return reject(parsed.error);
          }
          tmp.push({ ...parsed.data, index: 0 });
        }

        const tmpData = [...tmp.reverse().map((i, index) => ({ ...i, index }))];
        const reserved = tmpData.filter(
          ({ typ }) => typ === "Reserverat Belopp",
        );
        if (!!reserved) {
          reserved.forEach(({ belopp, index, datum }) => {
            const prev = tmpData[index - 1];
            if (!prev) {
              return reject(
                `Kan inte hantera reseverat belopp för datum: ${datum.toLocaleTimeString(
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

        resolve(tmpData);
      },
      error: () => {
        reject("Något gick fel.");
      },
    });
  });
};

export default parseTxs;
