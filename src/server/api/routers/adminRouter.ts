import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const adminRouter = createTRPCRouter({
  getAdminGraph: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user.id,
      },
    })

    console.log(user)
    if (!user || user?.isAdmin == false || user?.isAdmin == undefined) return null

    const communityGraph = await ctx.prisma.communityGraph.findUnique({
      where: {
        id: input.id,
      },
    })
    console.log(communityGraph)

    if (communityGraph) return communityGraph

    const userGraph = await ctx.prisma.graph.findUnique({
      where: {
        id: input.id,
      },
    })
    console.log(userGraph)

    if (userGraph) return userGraph
  }),
})
