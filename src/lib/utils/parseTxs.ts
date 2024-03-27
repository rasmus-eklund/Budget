import { parse } from "papaparse";
import { type Tx, type Typ, txSchema } from "~/lib/zodSchemas";

const parseTxs = async (buffer: Buffer, person: string, konto: string) => {
  const decoder = new TextDecoder("utf-8");
  const csvString = decoder.decode(buffer);
  return new Promise<Tx[]>((resolve, reject) => {
    parse(csvString, {
      delimiter: ";",
      header: false,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          reject("Something went wrong");
          return;
        }

        const tmp: Tx[] = [];
        result.data.slice(1).forEach((row, row_nr) => {
          const [date, text, typ, _, bel, sal] = row as [
            string,
            string,
            Typ,
            string,
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
          const tx: Tx = {
            id: row_nr.toString(),
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
