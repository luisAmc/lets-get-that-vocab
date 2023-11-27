import { lessonRouter } from './routers/lesson';
import { tagRouter } from './routers/tag';
import { unitRouter } from './routers/unit';
import { wordRouter } from './routers/word';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
	unit: unitRouter,
	lesson: lessonRouter,
	tag: tagRouter,
	word: wordRouter
});

export type AppRouter = typeof appRouter;
