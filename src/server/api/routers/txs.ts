import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type Typ } from "~/zodSchemas";
import timeDelta from "~/utils/calculateTimeDelta";
import categorize from "~/utils/categorize";
import { markInternal } from "~/utils/findInternal";
import { type Tx, datesSchema } from "~/zodSchemas";

export const txsRouter = createTRPCRouter({
  getTxByDates: protectedProcedure
    .input(datesSchema)
    .query(
      async ({
        ctx,
        input: { from, to },
      }): Promise<(Tx & { id: string })[]> => {
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
            AND: [
              { konto: { Person: { userId } } },
              { datum: { gte: from } },
              { datum: { lte: to } },
            ],
          },
          include: {
            konto: {
              select: { namn: true, Person: { select: { namn: true } } },
            },
          },
        });
        const formattedData = data.map(
          ({ konto, kontoId: _, belopp, saldo, typ, ...rest }) => ({
            ...rest,
            belopp: Number(belopp),
            saldo: Number(saldo),
            konto: konto.namn,
            person: konto.Person.namn,
            budgetgrupp: "övrigt",
            typ: typ as Typ,
          }),
        );
        const start = new Date();
        const internal = markInternal(formattedData).map((i) => ({
          ...i,
          budgetgrupp:
            i.budgetgrupp !== "inom" && i.belopp > 0
              ? "inkomst"
              : i.budgetgrupp,
        }));
        const final = internal.map((tx) => {
          if (tx.budgetgrupp === "övrigt") {
            return {
              ...tx,
              budgetgrupp: categorize(tx.text, categories),
            };
          }
          return tx;
        });
        const end = new Date();
        console.log(
          `Transactions ${final.length} took ${timeDelta({ start, end })}.`,
        );
        return final;
      },
    ),
});
