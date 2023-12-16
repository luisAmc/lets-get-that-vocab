import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { checkCreateAccessKey } from '~/utils/checkCreateAccessKey';

export const noteRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.note.findMany({
			orderBy: { createdAt: 'asc' },
			select: {
				id: true,
				name: true,
				date: true,
				adittionalNotes: true,
				fileSrc: true,
				createdAt: true,
			},
		});
	}),

	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				date: z.date(),
				adittionalNotes: z.string().optional(),
				fileSrc: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			checkCreateAccessKey(input.createAccessKey);

			return ctx.db.note.create({
				data: {
					name: input.name,
					date: input.date,
					adittionalNotes: input.adittionalNotes,
					fileSrc: input.fileSrc,
				},
			});
		}),
});
