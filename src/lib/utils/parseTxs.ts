import { parse } from "papaparse";
import { type Typ, type TxBankAccount, txBankAccount } from "~/lib/zodSchemas";
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
        if (result.errors.length > 0) {
          reject("Something went wrong");
          return;
        }

        const tmp: TxBankAccount[] = [];
        result.data.slice(1).forEach((row) => {
          const [date, text, typ, , bel, sal] = row as [
            string,
            string,
            Typ,
            undefined,
            string,
            string,
          ];
          const datum = new Date(date);
          const belopp = Number(
            bel.replace("kr", "").replace(",", ".").replace(" ", ""),
          );
          const saldo = Number(
            sal.replace("kr", "").replace(",", ".").replace(" ", ""),
          );
          const tx: TxBankAccount & { index: number } = {
            id: uuid(),
            datum,
            text,
            typ,
            budgetgrupp: "övrigt",
            belopp,
            saldo,
            bankAccountId,
            index: 0,
          };
          const parsed = txBankAccount.safeParse(tx);
          if (!parsed.success) {
            reject(parsed.error.message);
            return;
          }
          tmp.push(parsed.data);
        });

        const tmpData = [...tmp.reverse().map((i, index) => ({ ...i, index }))];
        const reserved = tmpData.filter(
          ({ typ }) => typ === "Reserverat Belopp",
        );
        if (!!reserved) {
          reserved.forEach(({ belopp, index, datum }) => {
            const prev = tmpData[index - 1];
            if (!prev) {
              reject(
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
              return;
            }
            tmpData[index]!.saldo = prev.saldo + belopp;
          });
        }

        resolve(tmpData);
      },
      error: () => {
        reject("Something went wrong");
      },
    });
  });
};

export default parseTxs;
