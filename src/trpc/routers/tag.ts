import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { checkCreateAccessKey } from '~/utils/checkCreateAccessKey';

export const tagRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) =>
		ctx.db.tag.findMany({
			select: {
				id: true,
				name: true,
			},
		}),
	),

	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			checkCreateAccessKey(input.createAccessKey);

			return ctx.db.tag.create({
				data: {
					name: input.name,
				},
			});
		}),
});
