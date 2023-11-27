import { createTRPCRouter, publicProcedure } from '../trpc';
import { QuestionType } from '@prisma/client';
import { z } from 'zod';

export const lessonRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			return ctx.db.lesson.findFirstOrThrow({
				where: { id: input.id },
				select: {
					id: true,
					name: true,
					words: true,
				},
			});
		}),

	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				unitId: z.string().min(1),
				questionTypes: z.array(z.string()).min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if unitId is valid
			await ctx.db.unit.findUniqueOrThrow({ where: { id: input.unitId } });

			const availableQuestionTypes = input.questionTypes.map(
				(type) => QuestionType[type as keyof typeof QuestionType],
			);

			return ctx.db.lesson.create({
				data: {
					unitId: input.unitId,
					name: input.name,
					availableQuestionTypes,
				},
			});
		}),
});
