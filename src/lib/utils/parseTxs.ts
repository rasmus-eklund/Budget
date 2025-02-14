import { parse } from "papaparse";
import {
  type TxBankAccount,
  type CsvSchema,
  csvSchema,
} from "~/lib/zodSchemas";
import { v4 as uuid } from "uuid";

const parseTxs = async (buffer: Buffer, bankAccountId: string) => {
  const decoder = new TextDecoder("utf-8");
  const csvString = decoder.decode(buffer);

  return new Promise<TxBankAccount[]>((resolve, reject) => {
    parse<CsvSchema>(csvString, {
      delimiter: ";",
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0)
          return reject(Error("Kunde inte läsa CSV filen."));
        console.log(result.data);
        const parsed = csvSchema.safeParse(result.data);
        if (!parsed.success) {
          console.log(parsed.error.format());
          return reject(parsed.error);
        }
        console.log(parsed.data);
        const tmpData = parsed.data.reverse().map((d, index) => ({
          ...d,
          budgetgrupp: "övrigt",
          index,
          bankAccountId,
          id: uuid(),
        }));

        const reserved = tmpData.filter(
          ({ typ }) => typ === "Reserverat Belopp",
        );
        if (!!reserved) {
          reserved.forEach(({ belopp, index, datum }) => {
            const prev = tmpData[index - 1];
            if (!prev) {
              return reject(
                Error(
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
                ),
              );
            }
            tmpData[index]!.saldo = prev.saldo + belopp;
          });
        }

        resolve(tmpData);
      },
      error: () => {
        reject(Error("Något gick fel."));
      },
    });
  });
};

export default parseTxs;
