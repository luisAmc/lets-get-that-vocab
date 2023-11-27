import { createTRPCRouter, publicProcedure } from '../trpc';

export const tagRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) =>
		ctx.db.tag.findMany({
			select: {
				id: true,
				name: true,
			},
		}),
	),
});
