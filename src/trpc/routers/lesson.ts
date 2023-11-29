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

	getQuestionSet: publicProcedure
		.input(
			z.object({
				lessonId: z.string().min(1),
				questionSetSize: z.number().int().positive(),
				questionTypes: z.string().min(1),
			}),
		)
		.query(async ({ ctx, input }) => {
			const wordsInOrder = await ctx.db.word.findMany({
				where: { lessonId: input.lessonId },
				select: {
					id: true,
					text: true,
					imgSrc: true,
					tag: {
						select: {
							name: true,
						},
					},
				},
			});

			let shuffledWords = shuffle(wordsInOrder);

			const selectedWords = shuffledWords.slice(0, input.questionSetSize);

			const plausibleQuestionTypes = input.questionTypes
				.split(',')
				.map((type) => fieldNameToQuestionType[type]);

			const questions = selectedWords.map((word) => {
				shuffledWords = shuffle(shuffledWords);

				const randomIndex = Math.max(
					Math.round(Math.random() * plausibleQuestionTypes.length - 1),
					0,
				);

				const questionType = plausibleQuestionTypes[randomIndex];

				let plausibleAnswers: Array<string> = [];
				let answer = word.text;

				if (questionType === QuestionType.SELECT_NAME) {
					plausibleAnswers = shuffle([
						word.text,
						...shuffledWords
							.filter((shuffledWord) => shuffledWord !== word)
							.slice(0, 2)
							.map((shuffledWord) => shuffledWord.text),
					]);
				}

				return { word, type: questionType, plausibleAnswers, answer };
			});

			return questions;
		}),
});

function shuffle<T>(array: Array<T>) {
	return array.sort(() => Math.random() - 0.5);
}

const fieldNameToQuestionType: Record<string, QuestionType> = {
	selectName: QuestionType.SELECT_NAME,
	selectImage: QuestionType.SELECT_IMAGE,
	selectPhrase: QuestionType.SELECT_PHRASE,
	inputName: QuestionType.INPUT_NAME,
} as const;
