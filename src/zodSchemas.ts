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
] as const;

export type Typ = (typeof types)[number];

export const txSchema = z.object({
  datum: z.date(),
  text: z.string(),
  typ: z.enum(types),
  budgetgrupp: z.string(),
  belopp: z.number(),
  saldo: z.number(),
  konto: z.string(),
  person: z.string(),
  index: z.number(),
});
export type Tx = z.infer<typeof txSchema>;

export const datesSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});
export type FromTo = z.infer<typeof datesSchema>;

export const nameSchema = z.object({
  name: z.string().min(2),
});
export type Name = z.infer<typeof nameSchema>;

export const matchSchema = z.object({
  name: z.string().min(2),
  budgetgruppId: z.string().cuid2(),
});
