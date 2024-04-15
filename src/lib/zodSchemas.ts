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

export type Typ = (typeof types)[number];

export const txBankAccount = z.object({
  id: z.string(),
  datum: z.date(),
  text: z.string(),
  typ: z.enum(types),
  budgetgrupp: z.string(),
  belopp: z.number(),
  saldo: z.number(),
  bankAccountId: z.string(),
});
export type TxBankAccount = z.infer<typeof txBankAccount>;

export const txSchema = z.object({
  id: z.string(),
  datum: z.date(),
  text: z.string(),
  typ: z.enum(types),
  budgetgrupp: z.string(),
  belopp: z.number(),
  saldo: z.number(),
  konto: z.string(),
  person: z.string(),
});
export type Tx = z.infer<typeof txSchema>;

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
