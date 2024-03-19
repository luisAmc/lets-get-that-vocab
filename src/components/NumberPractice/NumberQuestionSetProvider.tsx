import {
	type ReactNode,
	createContext,
	useState,
	useContext,
} from 'react';
import { RouterOutputs } from '~/utils/api';

type NumberQuestionType = RouterOutputs['number']['getQuestionSet'][number];

interface NumberQuestionSetContextType {
	currentQuestionIndex: number;

	questions: Array<NumberQuestionType>;
	answers: Array<NumberQuestionType['answer']>;

	questionsCount: number;
	answersCount: number;
	correctAnswersCount: number;
	incorrectAnswersCount: number;

	getQuestionByIndex(questionIndex: number): NumberQuestionType;
	getCurrentQuestion(): NumberQuestionType;
	answerQuestion(isCorrect: boolean): void;

	goToNextQuestion(): void;
}

const NumberQuestionSetContext = createContext<
	NumberQuestionSetContextType | undefined
>(undefined);

interface NumberQuestionSetProviderProps {
	questions: Array<NumberQuestionType>;
	children: ReactNode;
}

export function NumberQuestionSetProvider({
	questions,
	children,
}: NumberQuestionSetProviderProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const [answers, setAnswers] = useState(new Array(questions.length).fill(-1));

	const questionsCount = questions.length;
	const answersCount = answers.filter((answer) => answer !== -1).length;
	const correctAnswersCount = answers.filter((answer) => answer === 1).length;
	const incorrectAnswersCount = answers.filter((answer) => answer === 0).length;

	return (
		<NumberQuestionSetContext.Provider
			value={{
				currentQuestionIndex,

				questions,
				answers,

				questionsCount,
				answersCount,
				correctAnswersCount,
				incorrectAnswersCount,

				getQuestionByIndex: (questionIndex: number) => questions[questionIndex],
				getCurrentQuestion: () => questions[currentQuestionIndex],
				answerQuestion: (isCorrect) => {
					setAnswers((prevAnswers) => {
						const newAnswers = [...prevAnswers];
						newAnswers[currentQuestionIndex] = isCorrect ? 1 : 0;

						return newAnswers;
					});
				},

				goToNextQuestion: () => {
					if (currentQuestionIndex === questions.length - 1) {
						// Finished!
					} else {
						setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
					}
				},
			}}
		>
			{children}
		</NumberQuestionSetContext.Provider>
	);
}

export function useNumberQuestionSet() {
	const context = useContext(NumberQuestionSetContext);

	if (!context) {
		throw new Error(
			'`useNumberQuestionSet` can only be use inside a NumberQuestionSet component.',
		);
	}

	return context;
}
