import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { matchSchema } from "~/zodSchemas";

export const matchesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(matchSchema)
    .mutation(async ({ ctx, input: { name, budgetgruppId } }) => {
      console.log({name, budgetgruppId})
      await ctx.db.match.create({
        data: {
          namn: name,
          budgetgruppId,
        },
      });
    }),
  update: protectedProcedure
    .input(matchSchema)
    .mutation(async ({ ctx, input: { name, budgetgruppId: id } }) => {
      await ctx.db.match.update({
        where: { id },
        data: {
          namn: name,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.match.delete({
        where: { id },
      });
    }),
});
