import { CommunityGraphSchema, GraphSchema } from '../../../types/graph'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const communityGraphRouter = createTRPCRouter({
  createGraph: protectedProcedure.input(CommunityGraphSchema).mutation(async ({ input, ctx }) => {
    const communityGraph = await ctx.prisma.communityGraph.create({
      data: {
        ...input,
      },
    })
    return communityGraph
  }),
})
