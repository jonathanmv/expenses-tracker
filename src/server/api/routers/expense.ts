import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const expenseRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(0.01).max(1000000),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx.session;
      return ctx.prisma.expense.create({
        data: {
          amount: input.amount,
          description: input.description,
          currency: "EUR",
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }),
  list: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;
    return ctx.prisma.expense.findMany({
      where: {
        userId: user.id,
      },
    });
  }),
});
