import { z } from "zod";
import dayjs from "dayjs";

const numberSchema = z
  .string()
  .min(1, "Minst 1 siffra")
  .transform((val, ctx) => {
    const cleaned = val.replace(/[^\d,.\-]/g, "").replace(/\s+/g, "");
    let normalized = cleaned;
    if (/,/.test(cleaned) && /\./.test(cleaned)) {
      normalized = cleaned.replace(/,/g, "");
    } else {
      normalized = cleaned.replace(",", ".");
    }

    if (!/\d+/.test(normalized)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Felaktigt nummerformat: ${val}`,
      });
      return z.NEVER;
    }

    const num = Number(normalized);
    if (Number.isNaN(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Felaktigt nummerformat: ${val}`,
      });
      return z.NEVER;
    }

    return num;
  });

const dateSchema = z
  .string({ required_error: "Datum saknas." })
  .refine(
    (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
    (v) => ({
      message: `Felaktigt datum format: ${v}. Använd formatet YYYY-MM-DD.`,
    }),
  )
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
        belopp: numberSchema,
        saldo: numberSchema,
      }),
    ),
  )
  .min(1, "Minst 1 transaktion.");
export type CsvSchema = z.infer<typeof csvSchema>;

export type TxBankAccount = z.infer<typeof csvSchema>[number] & {
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
