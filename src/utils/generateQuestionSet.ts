import { WORDS, type WordType } from './words';

export type QUESTION_TYPE =
	| 'GUESS_IMAGE'
	| 'GUESS_NAME_A'
	| 'GUESS_NAME_B'
	| 'INPUT_NAME';

export interface QuestionType {
	word: WordType;
	plausibleAnswers: Array<string>;
	answer: string | number;
	type: QUESTION_TYPE;
}

export function generateQuestionSet(questionsPerSet = 10) {
	const shuffledWords = shuffle([...WORDS]);

	const selectedWords = shuffledWords.slice(0, questionsPerSet);

	const questions: Array<QuestionType> = selectedWords.map((word) => {
		const type = ['GUESS_IMAGE', 'GUESS_NAME_A', 'GUESS_NAME_B', 'INPUT_NAME'][
			Math.round(Math.random() * 3)
		] as QUESTION_TYPE;

		// const type = 'INPUT_NAME';

		let plausibleAnswers: Array<string> = [];
		let answer = word.text;

		if (type === 'GUESS_NAME_A') {
			// Traer respuestas reales
			plausibleAnswers = shuffle(['A', 'B', word.text]);
		} else if (type === 'GUESS_NAME_B') {
			// Cambiar por variaciones de la misma palabra
			plausibleAnswers = shuffle(['C', 'D', word.text]);
		} else if (type === 'INPUT_NAME') {
			plausibleAnswers = [];
		} else if (type === 'GUESS_IMAGE') {
			const randomPlausibleAnswers = shuffledWords
				.filter((otherWord) => otherWord.text !== word.text)
				.slice(0, 2);

			plausibleAnswers = shuffle([
				...randomPlausibleAnswers.map((otherWord) => otherWord.imgSrc),
				word.imgSrc,
			]);

			answer = plausibleAnswers.indexOf(word.imgSrc).toString();
		}

		return {
			word,
			type,
			plausibleAnswers,
			answer,
		};
	});

	return questions;
}

function shuffle<T>(array: Array<T>) {
	return array.sort(() => Math.random() - 0.5);
}
