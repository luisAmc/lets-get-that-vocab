import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const unitRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		// await new Promise((resolve) => setTimeout(resolve, 3000));

		return ctx.db.unit.findMany({
			select: {
				id: true,
				name: true,
				lessons: {
					select: {
						id: true,
						name: true,
						availableQuestionTypes: true,
						_count: {
							select: { words: true },
						},
					},
				},
			},
		});
	}),

	create: publicProcedure
		.input(
			z.object({ name: z.string().min(1), createAccessKey: z.string().min(1) }),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.createAccessKey !== process.env.CREATE_ACCESS_KEY) {
				throw new Error('Clave de creación incorrecta.');
			}

			return ctx.db.unit.create({
				data: {
					name: input.name,
				},
			});
		}),
});
