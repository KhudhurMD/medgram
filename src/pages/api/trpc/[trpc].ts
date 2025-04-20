import { createNextApiHandler } from '@trpc/server/adapters/next';

import { env } from '../../../env/server.mjs';
import { createTRPCContext } from '../../../server/api/trpc';
import { appRouter } from '../../../server/api/root';

export const trpcApi = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});

export default trpcApi;
