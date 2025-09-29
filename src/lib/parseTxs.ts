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

type ParserProps = {
  buffer: Buffer;
  bankAccountId: string;
  config: { skipLines: number; columns: Record<string, string> };
};

const parseTxs = async ({ buffer, bankAccountId, config }: ParserProps) => {
  const csvString = decodeBuffer(buffer);

  return new Promise<ParseResult>((resolve, reject) => {
    parse<Record<string, unknown>>(csvString, {
      delimiter: "",
      delimitersToGuess: [",", ";"],
      header: true,
      skipEmptyLines: true,
      beforeFirstChunk: (chunk) => {
        if (config.skipLines <= 0) return chunk;
        return chunk.split(/\r?\n/).slice(config.skipLines).join("\n");
      },
      complete: (result) => {
        if (result.errors.length > 0)
          return reject(Error("Kunde inte läsa CSV filen."));
        const remapped = result.data.map((row) =>
          remapRow(row, config.columns),
        );
        const parsed = csvSchema.safeParse(remapped);
        if (!parsed.success) {
          return resolve({ ok: false, error: parsed.error });
        }
        const tmpData = parsed.data.reverse().map((d) => ({
          ...d,
          budgetgrupp: "övrigt",
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

const remapRow = <T extends Record<string, unknown>>(
  row: T,
  columns: Record<string, string>,
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      columns[key] ?? key, // if a mapping exists, use it, otherwise keep key
      value,
    ]),
  );
};

const decodeBuffer = (buffer: Buffer): string => {
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return new TextDecoder("utf-8").decode(buffer);
  }
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  if (utf8.includes("\uFFFD")) {
    try {
      return new TextDecoder("latin1").decode(buffer);
    } catch {
      return new TextDecoder("windows-1252").decode(buffer);
    }
  }

  return utf8;
};
export default parseTxs;
