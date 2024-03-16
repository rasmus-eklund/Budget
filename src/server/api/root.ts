import { txsRouter } from "~/server/api/routers/txs";
import { createTRPCRouter } from "~/server/api/trpc";
import { categoriesRouter } from "./routers/categories";
import { matchesRouter } from "./routers/matches";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  txs: txsRouter,
  categories: categoriesRouter,
  matches: matchesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
