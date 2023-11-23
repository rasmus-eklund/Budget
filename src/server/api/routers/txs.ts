import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { datesSchema } from "~/zodSchemas";

export const txsRouter = createTRPCRouter({
  getTxByDates: protectedProcedure
    .input(datesSchema)
    .query(async ({ ctx, input: { from, to } }) => {
      const data = await ctx.db.txs.findMany({
        where: { AND: [{ datum: { gte: from } }, { datum: { lte: to } }] },
        include: {
          konto: { select: { namn: true, Person: { select: { namn: true } } } },
        },
      });
      return data.map(({ belopp, saldo, ...rest }) => ({
        ...rest,
        belopp: Number(belopp),
        saldo: Number(saldo),
      }));
    }),
});
