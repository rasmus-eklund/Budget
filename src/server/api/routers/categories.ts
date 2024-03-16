import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { nameSchema } from "~/zodSchemas";

export const categoriesRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      const userId = ctx.session.user.id;
      const res = await ctx.db.budgetgrupp.findUnique({
        where: { id, userId },
        include: { matches: true },
      });
      if (!res) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return {
        namn: res.namn,
        matches: res.matches.map(({ namn, id }) => ({ namn, id })),
      };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const data = await ctx.db.budgetgrupp.findMany({ where: { userId } });
    return data.map(({ namn, id }) => ({ namn, id }));
  }),
  create: protectedProcedure
    .input(nameSchema)
    .mutation(async ({ ctx, input: { name } }) => {
      const userId = ctx.session.user.id;
      await ctx.db.budgetgrupp.create({
        data: {
          namn: name,
          userId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input: { name, id } }) => {
      const userId = ctx.session.user.id;
      await ctx.db.budgetgrupp.update({
        where: { id, userId },
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
      const userId = ctx.session.user.id;
      await ctx.db.budgetgrupp.delete({
        where: { id, userId },
      });
    }),
});
