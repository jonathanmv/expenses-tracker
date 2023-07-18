import { createTRPCRouter } from "@/server/api/trpc";
import { budgetRouter } from "./routers/budget";
import { expenseRouter } from "./routers/expense";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  expense: expenseRouter,
  budget: budgetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
