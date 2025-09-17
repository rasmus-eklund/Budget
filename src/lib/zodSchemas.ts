import { z } from "zod";
import dayjs from "dayjs";

const makeErrorMap = (messages: {
  [Code in z.ZodIssueCode]?: (value: unknown) => string;
}): { errorMap: z.ZodErrorMap } => {
  return {
    errorMap: (issue, ctx) => {
      return {
        message: messages[issue.code]?.(ctx.data) ?? ctx.defaultError,
      };
    },
  };
};

const formatSek = (v: string) => {
  const cleaned = v.replace(/\s/g, "").replace(",", ".").replace("kr", "");
  return Number(cleaned);
};

const dateSchema = z
  .string({ required_error: "Datum saknas." })
  .refine(
    (v) => {
      const parsed = dayjs(v, "YYYY-MM-DD", true);
      return parsed.isValid() && parsed.format("YYYY-MM-DD") === v;
    },
    (v) => ({
      message: `Felaktigt datum format: ${v}. Använd formatet YYYY-MM-DD.`,
    }),
  )
  .transform((v) => dayjs(v, "YYYY-MM-DD").toDate());

export const csvSchema = z
  .array(
    z.preprocess(
      (obj) => {
        if (typeof obj === "object" && obj !== null) {
          return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
              key.toLowerCase(),
              value,
            ]),
          );
        }
        return obj;
      },
      z.object({
        datum: dateSchema,
        text: z
          .string({ required_error: "Text saknas." })
          .min(1, "Text måste vara på minst 1 tecken"),
        belopp: z
          .string({ required_error: "Belopp saknas." })
          .refine(
            (v) => /^-?\d{1,3}(\s\d{3})*,\d{2}\skr$/.test(v),
            (v) => ({
              message: `Felaktigt valutaformat: ${v}. Använd: 1 000,00 kr`,
            }),
          )
          .transform(formatSek),
        saldo: z
          .string(makeErrorMap({ invalid_type: () => "Saldo saknas." }))
          .refine(
            (v) => /^-?\d{1,3}(\s\d{3})*,\d{2}\skr$/.test(v),
            (v) => ({
              message: `Felaktigt valutaformat: ${v}. Använd: 1 000,00 kr`,
            }),
          )
          .transform(formatSek),
      }),
    ),
  )
  .min(1, "Minst 1 transaktion.");
export type CsvSchema = z.infer<typeof csvSchema>;

export type TxBankAccount = z.infer<typeof csvSchema>[number] & {
  index: number;
  bankAccountId: string;
  budgetgrupp: string;
  id: string;
};

export const fromToSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});
export type FromTo = z.infer<typeof fromToSchema>;

export const matchSchema = z.object({
  name: z.string().min(2, "Minst 2 tecken."),
  budgetgruppId: z.string().cuid2(),
});

export const encryptedDataSchema = z.object({
  text: z.string(),
  budgetgrupp: z.string(),
  belopp: z.coerce.number(),
  saldo: z.coerce.number(),
});
export type EncryptedDataSchema = z.infer<typeof encryptedDataSchema>;

export const passwordsSchema = z.object({
  password: z.string().min(4, "Minst 4 tecken"),
});

export type Passwords = z.infer<typeof passwordsSchema>;

export const jsonSchema = z
  .array(
    z.object({
      name: z.string().min(2, "Minst 2 tecken."),
      match: z
        .array(
          z.object({
            name: z.string().min(2, "Minst 2 tecken."),
          }),
        )
        .min(1, "Minst 1 matchning."),
    }),
  )
  .min(1, "Minst 1 kategori.");

export type JsonData = z.infer<typeof jsonSchema>;
