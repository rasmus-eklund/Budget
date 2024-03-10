import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
    .input(
      z.object({
        name: z.string().min(2),
        matches: z.array(z.string().min(2)),
      }),
    )
    .mutation(async ({ ctx, input: { name, matches } }) => {
      const userId = ctx.session.user.id;
      await ctx.db.budgetgrupp.create({
        data: {
          namn: name,
          matches: { createMany: { data: matches.map((namn) => ({ namn })) } },
          userId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(2),
        matches: z.array(z.string().min(2)),
      }),
    )
    .mutation(async ({ ctx, input: { name, matches, id } }) => {
      const userId = ctx.session.user.id;
      await ctx.db.budgetgrupp.update({
        where: { id, userId },
        data: {
          namn: name,
          matches: {
            deleteMany: { budgetgruppId: id },
            createMany: { data: matches.map((namn) => ({ namn })) },
          },
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
