import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { checkCreateAccessKey } from '~/utils/checkCreateAccessKey';

export const unitRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.unit.findMany({
			orderBy: { createdAt: 'asc' },
			select: {
				id: true,
				name: true,
				lessons: {
					orderBy: { createdAt: 'asc' },
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
			z.object({
				name: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			checkCreateAccessKey(input.createAccessKey);

			return ctx.db.unit.create({
				data: {
					name: input.name,
				},
			});
		}),

	edit: publicProcedure
		.input(
			z.object({
				unitId: z.string().min(1),
				name: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			checkCreateAccessKey(input.createAccessKey);

			return ctx.db.unit.update({
				where: { id: input.unitId },
				data: {
					name: input.name,
				},
			});
		}),
});
