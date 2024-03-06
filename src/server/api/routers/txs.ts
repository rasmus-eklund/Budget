import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import categorize from "~/utils/categorize";
import { markInternal } from "~/utils/findInternal";
import { decimalToNumber } from "~/utils/formatData";
import { datesSchema } from "~/zodSchemas";

export const txsRouter = createTRPCRouter({
  getTxByDates: protectedProcedure
    .input(datesSchema)
    .query(async ({ ctx, input: { from, to } }) => {
      const userId = ctx.session.user.id;
      const response = await ctx.db.budgetgrupp.findMany({
        where: { userId },
      });
      const categories = response.map(({ namn, matches }) => ({
        namn,
        matches,
      }));
      const data = await ctx.db.txs.findMany({
        where: {
          AND: [
            { konto: { Person: { userId } } },
            { datum: { gte: from } },
            { datum: { lte: to } },
          ],
        },
        include: {
          konto: { select: { namn: true, Person: { select: { namn: true } } } },
        },
      });
      const kontoPerson = data.map(({ konto, kontoId: _, ...rest }) => ({
        ...rest,
        konto: konto.namn,
        person: konto.Person.namn,
      }));
      const toNumber = decimalToNumber(kontoPerson);
      const internal = markInternal(toNumber);
      return internal.map((tx) => {
        if (tx.budgetgrupp === "Övrigt") {
          return {
            ...tx,
            budgetgrupp: categorize(tx.text, categories),
          };
        }
        return tx;
      });
    }),
});
