import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { txSchema, type Typ } from "~/zodSchemas";
import categorize from "~/utils/categorize";
import { type Tx, datesSchema } from "~/zodSchemas";
import { z } from "zod";

export const txsRouter = createTRPCRouter({
  getTxByDates: protectedProcedure
    .input(datesSchema)
    .query(async ({ ctx, input: { from, to } }): Promise<Tx[]> => {
      const userId = ctx.session.user.id;
      const response = await ctx.db.budgetgrupp.findMany({
        where: { userId },
        include: { matches: true },
      });
      const categories = response.map(({ namn, matches }) => ({
        namn,
        matches: matches.map(({ namn }) => namn),
      }));
      const data = await ctx.db.txs.findMany({
        where: {
          userId,
          AND: [{ datum: { gte: from } }, { datum: { lte: to } }],
        },
      });
      const final = data.map((tx) => {
        const belopp = Number(tx.belopp);
        const saldo = Number(tx.saldo);
        const typ = tx.typ as Typ;
        let budgetgrupp = tx.budgetgrupp;
        if (tx.budgetgrupp !== "inom" && belopp > 0) {
          budgetgrupp = "inkomst";
        }
        if (budgetgrupp === "övrigt") {
          budgetgrupp = categorize(tx.text, categories) ?? budgetgrupp;
        }
        return { ...tx, belopp, saldo, typ, budgetgrupp };
      });
      return final;
    }),
  replaceYear: protectedProcedure
    .input(z.object({ txs: z.array(txSchema), year: z.number().positive() }))
    .mutation(async ({ ctx, input: { txs, year } }) => {
      const userId = ctx.session.user.id;
      await ctx.db.txs.deleteMany({
        where: {
          userId,
          AND: [
            {
              datum: {
                gte: new Date(`${year}-01-01`),
                lte: new Date(`${year}-12-31`),
              },
            },
          ],
        },
      });
      const data = txs.map((i) => ({
        ...i,
        belopp: i.belopp.toFixed(2),
        saldo: i.saldo.toFixed(2),
        userId,
      }));
      await ctx.db.txs.createMany({ data });
    }),
  getCountsPerYear: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const result: CountPerYear[] = await ctx.db
      .$queryRaw`SELECT COUNT(*), EXTRACT(YEAR FROM "public"."Txs"."datum") as year 
      FROM "public"."Txs" 
      WHERE "public"."Txs"."userId" = ${userId} 
      GROUP BY year;`;
    return result.map((i) => ({ ...i, count: Number(i.count) }));
  }),
});

type CountPerYear = { count: bigint; year: number };
