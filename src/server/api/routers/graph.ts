import { GraphSchema } from '../../../types/graph';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const graphRouter = createTRPCRouter({
  updateGraph: publicProcedure.input(GraphSchema).mutation(({ input, ctx }) => {
    if (!input.anonymousId && !ctx.session?.user?.id) return null;

    return ctx.prisma.graph.upsert({
      where: {
        id: input.id,
      },
      update: {
        ...input,
        updatedAt: new Date().toISOString(),
      },
      create: {
        ...input,
        updatedAt: new Date().toISOString(),
      },
    });
  }),
  getGraph: publicProcedure.input(z.object({ id: z.string(), anonymousId: z.string().optional() })).query(({ input, ctx }) => {
    if (!input.anonymousId && !ctx.session?.user?.id) return null;

    return ctx.prisma.graph.findFirst({
      where: {
        OR: [
          {
            userId: ctx.session?.user?.id,
          },
          {
            anonymousId: input.anonymousId,
          },
        ],
        id: input.id,
      },
    });
  }),
  getLastGraph: publicProcedure.input(z.object({ anonymousId: z.string().optional() })).query(({ input, ctx }) => {
    if (!input.anonymousId && !ctx.session?.user?.id) return null;

    return ctx.prisma.graph.findFirst({
      where: {
        OR: [
          {
            userId: ctx.session?.user?.id,
          },
          {
            anonymousId: input.anonymousId,
          },
        ],
        editorVersion: 'v2',
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }),
  deleteGraph: publicProcedure.input(z.object({ id: z.string(), anonymousId: z.string().optional() })).mutation(({ input, ctx }) => {
    if (!input.anonymousId && !ctx.session?.user?.id) return null;

    return ctx.prisma.graph.deleteMany({
      where: {
        OR: [
          {
            userId: ctx.session?.user?.id,
            id: input.id,
          },
          {
            anonymousId: input.anonymousId,
            id: input.id,
          },
        ],
      },
    });
  }),
  getUserGraphs: publicProcedure
    .input(z.object({ anonymousId: z.string().optional(), editorVersion: z.string().optional() }))
    .query(({ input, ctx }) => {
      if (!input.anonymousId && !ctx.session?.user?.id) return null;

      return ctx.prisma.graph.findMany({
        where: {
          OR: [
            {
              userId: ctx.session?.user?.id,
            },
            {
              anonymousId: input.anonymousId,
            },
          ],
          editorVersion: input.editorVersion ?? 'v1',
        },

        orderBy: {
          updatedAt: 'desc',
        },
      });
    }),
  transferAnonymousGraphsToUser: protectedProcedure.input(z.object({ anonymousId: z.string() })).mutation(({ input, ctx }) => {
    if (!ctx.session?.user?.id) return null;

    return ctx.prisma.graph.updateMany({
      where: {
        anonymousId: input.anonymousId,
      },
      data: {
        userId: ctx.session.user.id,
        anonymousId: undefined,
      },
    });
  }),
});
