import { createServerSideHelpers } from '@trpc/react-query/server';
import { Session } from 'next-auth';
import { appRouter } from '../server/api/root';
import { prisma } from '../server/db';
import superjson from 'superjson';

export const serverApi = createServerSideHelpers({
  router: appRouter,
  ctx: { session: null, prisma: prisma },
  transformer: superjson,
});

export const serverApiAuth = (session: Session | null) =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { session: session ?? null, prisma: prisma },
    transformer: superjson,
  });
