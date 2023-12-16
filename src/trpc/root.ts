import { fileRouter } from './routers/file';
import { lessonRouter } from './routers/lesson';
import { noteRouter } from './routers/note';
import { tagRouter } from './routers/tag';
import { unitRouter } from './routers/unit';
import { wordRouter } from './routers/word';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
	file: fileRouter,
	unit: unitRouter,
	lesson: lessonRouter,
	tag: tagRouter,
	word: wordRouter,
	note: noteRouter,
});

export type AppRouter = typeof appRouter;
