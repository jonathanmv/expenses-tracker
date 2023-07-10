import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  greet: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;
    if (!user || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return {
      greeting: `Hola ${user.email}`,
    };
  }),
});
