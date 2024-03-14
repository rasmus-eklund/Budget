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
export type tDatesSchema = z.infer<typeof datesSchema>;

export const categorySchema = z.object({
  name: z.string().min(2),
  matches: z.array(z.object({ name: z.string().min(2) })).min(1),
});
export type tCategortSchema = z.infer<typeof categorySchema>;
