import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { numberToHanja } from '~/utils/transforms';

const RANGES = {
	'1TO99': '1TO99',
	'100TO9_999': '100TO9_999',
	'10KTO100M': '10KTO100M',
	'1TO100M': '1TO100M',
} as const;

const QUESTION_TYPES = {
	INPUT_NAME: 'inputName',
	BOTH: 'both',
	INPUT_NUMBER: 'inputNumber',
} as const;

export const numberRouter = createTRPCRouter({
	getQuestionSet: publicProcedure
		.input(
			z.object({
				questionSetSize: z.number(),
				range: z.nativeEnum(RANGES),
				questionType: z.nativeEnum(QUESTION_TYPES),
			}),
		)
		.query(async ({ input }) => {
			let [min, max] = [1, 1];

			if (input.range === RANGES['1TO99']) {
				[min, max] = [1, 99];
			} else if (input.range === RANGES['100TO9_999']) {
				[min, max] = [100, 9_999];
			} else if (input.range === RANGES['10KTO100M']) {
				[min, max] = [10_000, 99_999_999];
			} else if (input.range === RANGES['1TO100M']) {
				[min, max] = [1, 99_999_999];
			}

			const numbers = generateRandomNumbersInRange(
				input.questionSetSize,
				min,
				max,
			);

			const questions = [];
			if (input.questionType === QUESTION_TYPES.INPUT_NAME) {
				for (const number of numbers) {
					questions.push({
						question: number,
						answer: numberToHanja(number),
					});
				}
			} else if (input.questionType === QUESTION_TYPES.INPUT_NUMBER) {
				for (const number of numbers) {
					questions.push({
						question: numberToHanja(number),
						answer: number,
					});
				}
			} else if (input.questionType === QUESTION_TYPES.BOTH) {
				for (const number of numbers) {
					const isInputName = coinFlip();

					if (isInputName) {
						questions.push({
							question: number,
							answer: numberToHanja(number),
						});
					} else {
						questions.push({
							question: numberToHanja(number),
							answer: number,
						});
					}
				}
			}

			return questions;
		}),
});

function generateRandomNumbersInRange(size = 1, min: number, max: number) {
	return Array.from(
		{ length: size },
		() => Math.floor(Math.random() * (max - min + 1)) + min,
	);
}

function coinFlip() {
	return Math.round(Math.random());
}
