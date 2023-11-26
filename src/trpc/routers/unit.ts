import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const unitRouter = createTRPCRouter({
	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.db.unit.findMany({});
	}),

	create: publicProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.unit.create({
				data: {
					name: input.name,
				},
			});
		}),
});
