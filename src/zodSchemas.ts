import { z } from "zod";

export const txSchema = z.object({
  datum: z.date(),
  text: z.string(),
  typ: z.string(),
  budgetgrupp: z.string(),
  belopp: z.number(),
  saldo: z.number(),
  konto: z.string(),
  person: z.string(),
  index: z.number(),
});

export type Tx = z.infer<typeof txSchema>;
