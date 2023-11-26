import { unitRouter } from './routers/unit';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({ unit: unitRouter });

export type AppRouter = typeof appRouter;
