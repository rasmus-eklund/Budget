import { z } from "zod";

export const types = [
  "Insättning",
  "Korttransaktion",
  "Övrigt",
  "Uttag",
  "Autogiro",
  "Pg-bg",
  "E-faktura",
  "Pg-Bg",
  "Utlandsbetalning",
  "Reserverat Belopp",
] as const;

const formatSek = (v: string) => {
  const cleaned = v
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? NaN : num;
};

const dateSchema = z
  .string({ required_error: "Datum saknas." })
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "Felakting datumformat. Använd formatet YYYY-MM-DD.",
  })
  .transform((v) => {
    const parts = v.split("-").map(Number) as [number, number, number];
    if (
      parts.length !== 3 ||
      isNaN(parts[0]) ||
      isNaN(parts[1]) ||
      isNaN(parts[2])
    ) {
      throw new Error("Felakting datumformat.");
    }
    const [year, month, day] = parts;
    const date = new Date(Date.UTC(year, month - 1, day));
    if (isNaN(date.getTime())) {
      throw new Error("Felakting datum.");
    }
    return date;
  });

export const csvSchema = z.object({
  id: z.string(),
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
    .transform(formatSek)
    .refine((v) => !isNaN(v), {
      message: "Ogiltigt format på belopp. Använd - 200,00 kr eller 200.00 kr",
    }),
  saldo: z
    .string({ required_error: "Saldo saknas." })
    .transform(formatSek)
    .refine((v) => !isNaN(v), {
      message: "Ogiltigt format på belopp. Använd - 200,00 kr eller 200.00 kr",
    }),
  bankAccountId: z.string(),
});

export type TxBankAccount = z.infer<typeof csvSchema> & { index: number };

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

export const passwordsSchema = z
  .object({
    password: z.string().min(4, "Minst 4 tecken"),
    confirm: z.string().min(4, "Minst 4 tecken"),
  })
  .refine((data) => data.confirm === data.password, {
    path: ["confirm"],
    message: "Lösenorden matchar inte",
  });

export type Passwords = z.infer<typeof passwordsSchema>;
