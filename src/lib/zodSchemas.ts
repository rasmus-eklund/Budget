import { z } from "zod";
import dayjs from "dayjs";
import { types } from "~/lib/constants/types";

const columns = [
  "Datum",
  "Text",
  "Typ",
  "Budgetgrupp",
  "Belopp",
  "Saldo",
] as const;

export const csvColumnsSchema = z.array(
  z.enum(columns, {
    errorMap: (issue, _ctx) => {
      switch (issue.code) {
        case "invalid_type":
          return {
            message: `Csv filen måste ha dessa kolumner: '${columns.join(", ")}'`,
          };
        case "invalid_enum_value":
          return {
            message: `Csv filen måste ha dessa kolumner: '${columns.join(", ")}'`,
          };
        default:
          return { message: "Fel typ" };
      }
    },
  }),
);

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
    { message: "Felaktigt datum. Använd formatet YYYY-MM-DD." },
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
        typ: z.enum(types, {
          errorMap: (issue, _ctx) => {
            switch (issue.code) {
              case "invalid_type":
                return { message: `Typ måste vara en av ${types.join(", ")}` };
              case "invalid_enum_value":
                return { message: `Typ måste vara en av ${types.join(", ")}` };
              default:
                return { message: "Fel typ" };
            }
          },
        }),
        budgetgrupp: z.string({ required_error: "Budgetgrupp saknas." }),
        belopp: z
          .string({ required_error: "Belopp saknas." })
          .refine((v) => /^-?\d{1,3}(\s\d{3})*,\d{2}\skr$/.test(v), {
            message: "Felaktigt SEK format. Ok: 1 000,00 kr",
          })
          .transform(formatSek),
        saldo: z
          .string({ required_error: "Saldo saknas." })
          .refine((v) => /^-?\d{1,3}(\s\d{3})*,\d{2}\skr$/.test(v), {
            message: "Felaktigt SEK format. Ok: 1 000,00 kr",
          })
          .transform(formatSek),
      }),
    ),
  )
  .min(1, "Minst 1 transaktion.");
export type CsvSchema = z.infer<typeof csvSchema>;

export type TxBankAccount = z.infer<typeof csvSchema>[number] & {
  index: number;
  bankAccountId: string;
  id: string;
};

export const fromToSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});
export type FromTo = z.infer<typeof fromToSchema>;

export const nameSchema = z.object({
  name: z.string().min(2, "Minst 2 tecken."),
});
export type Name = z.infer<typeof nameSchema>;

export const matchSchema = z.object({
  name: z.string().min(2, "Minst 2 tecken."),
  budgetgruppId: z.string().cuid2(),
});

export const encryptedDataSchema = z.object({
  text: z.string(),
  typ: z.enum(types),
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
