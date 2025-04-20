import { createTRPCRouter } from './trpc';
import { userRouter } from './routers/user';
import { graphRouter } from './routers/graph';
import { Session } from 'next-auth';
import { graphlinkRouter } from './routers/graphlink';
import { wishlistRouter } from './routers/wishlist';
import { utilsRouter } from './routers/utils';
import { adminRouter } from './routers/adminRouter';
import { communityGraphRouter } from './routers/communityGraphRouter';
import { prisma } from '../db';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { publicGraphsRouter } from './routers/publicGraphs';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  graph: graphRouter,
  communityGraph: communityGraphRouter,
  admin: adminRouter,
  graphlink: graphlinkRouter,
  wishlist: wishlistRouter,
  utils: utilsRouter,
  publicGraphs: publicGraphsRouter,
});

export const createTRPCServer = (session: Session | null) => appRouter.createCaller({ session, prisma });

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

// export type definition of API
export type AppRouter = typeof appRouter;
