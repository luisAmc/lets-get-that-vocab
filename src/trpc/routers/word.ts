import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { checkCreateAccessKey } from '~/utils/checkCreateAccessKey';

export const wordRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ ctx, input }) =>
			ctx.db.word.findFirstOrThrow({
				where: { id: input.id },
				select: {
					id: true,
					text: true,
					imgSrc: true,
					tag: { select: { id: true, name: true } },
				},
			}),
		),

	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				imgSrc: z.string().min(1),
				tagId: z.string().min(1),
				lessonId: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			checkCreateAccessKey(input.createAccessKey);

			// Check if tagId is valid
			await ctx.db.tag.findFirstOrThrow({ where: { id: input.tagId } });

			// Check if lessonId is valid
			await ctx.db.lesson.findFirstOrThrow({ where: { id: input.lessonId } });

			return ctx.db.word.create({
				data: {
					text: input.name,
					imgSrc: input.imgSrc,
					tagId: input.tagId,
					lessonId: input.lessonId,
				},
			});
		}),

	edit: publicProcedure
		.input(
			z.object({
				wordId: z.string().min(1),
				name: z.string().min(1),
				imgSrc: z.string().optional(),
				tagId: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			checkCreateAccessKey(input.createAccessKey);

			// Check if tagId is valid
			await ctx.db.tag.findFirstOrThrow({ where: { id: input.tagId } });

			return ctx.db.word.update({
				where: { id: input.wordId },
				data: {
					text: input.name,
					imgSrc: input.imgSrc,
					tagId: input.tagId,
				},
			});
		}),
});
