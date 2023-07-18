import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const budgetRouter = createTRPCRouter({
  todaysBudget: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;
    const userId = user.id;
    return ctx.prisma.budget.findFirst({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
  }),
  add: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(0.01).max(1000000),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx.session;
      return ctx.prisma.budget.create({
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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().min(0.01).max(1000000),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      /**
       * I get an error trying to use `update` with the userId in the where clause.
       * @see https://github.com/prisma/prisma/discussions/15726
       *
       * My problem is not solved by the workaround in the discussion.
       * I'm querying by id and userId and updating the budget if found.
       */
      const budget = await ctx.prisma.budget.findFirst({
        where: {
          id: input.id,
          userId: user.id,
        },
      });
      if (!budget) {
        return input;
      }

      return ctx.prisma.budget.update({
        where: {
          id: input.id,
        },
        data: {
          amount: input.amount,
          description: input.description,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    const { user } = ctx.session;
    return ctx.prisma.budget.findFirst({
      where: {
        id: input,
        userId: user.id,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      /**
       * I get an error trying to use `update` with the userId in the where clause.
       * @see https://github.com/prisma/prisma/discussions/15726
       *
       * My problem is not solved by the workaround in the discussion.
       * I'm querying by id and userId and updating the budget if found.
       */
      const budget = await ctx.prisma.budget.findFirst({
        where: {
          id: input,
          userId: user.id,
        },
      });
      if (!budget) {
        return undefined;
      }

      return ctx.prisma.budget.delete({
        where: {
          id: input,
        },
      });
    }),
  list: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;
    return ctx.prisma.budget.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  /**
   * THIS INCREASES OUR READS. Consider grouping in the client instead.
   */
  groupedByDate: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;
    const userId = user.id;
    type BudgetGroupedByDate = {
      createdDate: Date;
      amount: number;
    };

    return ctx.prisma.$queryRaw<
      BudgetGroupedByDate[]
    >`SELECT DATE(createdAt) as createdDate, SUM(amount) as amount FROM Budget WHERE userId = ${userId} GROUP BY 1 ORDER BY createdDate DESC`;
  }),
});
