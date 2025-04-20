import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const createLinkInputSchema = z.object({
  graphId: z.string(),
  canClone: z.boolean(),
})
export const graphlinkRouter = createTRPCRouter({
  createLink: protectedProcedure.input(createLinkInputSchema).query(async ({ input, ctx }) => {
    const { graphId, canClone } = input

    // Check if already exists
    const existingLink = await ctx.prisma.graphLink.findFirst({
      where: {
        graphId,
        canClone,
      },
    })
    if (existingLink) return existingLink

    // if not, create a new link
    return ctx.prisma.graphLink.create({
      data: {
        graphId,
        canClone,
      },
    })
  }),
  getGraphView: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { id } = input
    return ctx.prisma.graphLink.findUnique({
      where: {
        id,
      },
      include: {
        graph: true,
      },
    })
  }),
  getGraphCopy: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { id } = input
    const link = await ctx.prisma.graphLink.findUnique({
      where: {
        id,
      },
      include: {
        graph: true,
      },
    })
    if (!link?.canClone) return null
    return link
  }),
})
