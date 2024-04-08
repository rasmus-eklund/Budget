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
  index: z.number(),
});
export type Tx = z.infer<typeof txSchema>;

export const datesSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});
export type FromTo = z.infer<typeof datesSchema>;

export const nameSchema = z.object({
  name: z.string().min(2, 'Minst 2 tecken.'),
});
export type Name = z.infer<typeof nameSchema>;

export const matchSchema = z.object({
  name: z.string().min(2, 'Minst 2 tecken.'),
  budgetgruppId: z.string().cuid2(),
});

export const dbTxSchema = z.object({
  text: z.string(),
  typ: z.enum(types),
  budgetgrupp: z.string(),
  belopp: z.coerce.number(),
  saldo: z.coerce.number(),
  konto: z.string(),
  person: z.string(),
  index: z.coerce.number(),
});

export const passwordsSchema = z
  .object({
    password: z.string().min(4, "Minst 4 tecken"),
    confirm: z.string().min(4, "Minst 4 tecken"),
  })
  .refine((data) => data.confirm === data.password, {
    path: ["confirm"],
    message: "Lösenorden matchar inte",
  });
