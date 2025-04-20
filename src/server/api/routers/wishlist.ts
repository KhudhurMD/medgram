import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const wishlistRouter = createTRPCRouter({
  add: publicProcedure.input(z.object({ email: z.string() })).mutation(async ({ input, ctx }) => {
    // if not, create a new link
    const { email } = input
    await ctx.prisma.wishlistEmails
      .create({
        data: {
          email,
        },
      })
      .catch((err) => {
        if (err.code === 'P2002') {
          console.log('Email already exists')
        }
      })
  }),
})
