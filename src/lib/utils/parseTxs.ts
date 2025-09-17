import { parse } from "papaparse";
import {
  type TxBankAccount,
  type CsvSchema,
  csvSchema,
} from "~/lib/zodSchemas";
import { v4 as uuid } from "uuid";
import type { ZodError } from "zod";

type ParseResult =
  | { ok: true; data: TxBankAccount[] }
  | { ok: false; error: ZodError<CsvSchema> };

const parseTxs = async (buffer: Buffer, bankAccountId: string) => {
  const decoder = new TextDecoder("utf-8");
  const csvString = decoder.decode(buffer);

  return new Promise<ParseResult>((resolve, reject) => {
    parse<CsvSchema>(csvString, {
      delimiter: ";",
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0)
          return reject(Error("Kunde inte läsa CSV filen."));
        const parsed = csvSchema.safeParse(result.data);
        if (!parsed.success) {
          return resolve({ ok: false, error: parsed.error });
        }
        const tmpData = parsed.data.reverse().map((d, index) => ({
          ...d,
          budgetgrupp: "övrigt",
          index,
          bankAccountId,
          id: uuid(),
        }));
        resolve({ ok: true, data: tmpData });
      },
      error: () => {
        reject(Error("Något gick fel."));
      },
    });
  });
};

export default parseTxs;
