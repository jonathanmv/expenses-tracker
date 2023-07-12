import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
  setProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(20),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx.session;
      return ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: input,
      });
    }),
});
