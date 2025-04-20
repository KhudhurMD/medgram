import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import type { PublicGraph } from '@prisma/client';

export const publicGraphsRouter = createTRPCRouter({
  search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input, ctx }) => {
    const { query } = input;

    const isQueryEmpty = query.trim() === '';

    if (isQueryEmpty) {
      console.info('Query is empty, returning all public graphs');
      return ctx.prisma.$queryRaw`SELECT * FROM "PublicGraph" ORDER BY "updatedAt" DESC` as Promise<PublicGraph[]>;
    }

    const searchQuery = query
      .split(' ')
      .map((word) => `${word}:*`)
      .join(' & ');

    return ctx.prisma.$queryRaw`
      SELECT *,
             ts_rank(setweight(to_tsvector('english', "title"), 'A') || setweight(to_tsvector('english', "description"), 'B'), to_tsquery('english', ${searchQuery})) AS rank
      FROM "PublicGraph"
      WHERE to_tsvector('english', "title" || ' ' || "description") @@ to_tsquery('english', ${searchQuery})
      ORDER BY rank DESC, "updatedAt" DESC
    ` as Promise<PublicGraph[]>;
  }),

  getAllSlugs: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.publicGraph.findMany({
      select: {
        slug: true,
      },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.publicGraph.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input, ctx }) => {
    const { slug } = input;

    return ctx.prisma.publicGraph.findFirst({
      where: {
        slug,
      },
    });
  }),
});
