import { ReactNode, createContext, useContext, useState } from 'react';
import { RouterOutputs } from '~/utils/api';

type QuestionObject = RouterOutputs['lesson']['getQuestionSet'][number];

interface QuestionSetContextType {
	currentQuestionIndex: number;
	questions: Array<QuestionObject>;
	answers: Array<number>;
	questionCount: number;
	answerCount: number;
	correctAnswerCount: number;
	incorrectAnswerCount: number;
	getQuestionByIndex(questionIndex: number): QuestionObject;
	getCurrentQuestion(): QuestionObject;
	answerQuestion(isCorrect: boolean): void;
	goToNextQuestion(): void;
}

const QuestionSetContext = createContext<QuestionSetContextType | undefined>(
	undefined,
);

interface QuestionSetProviderProps {
	questions: Array<QuestionObject>;
	children: ReactNode;
}

export function QuestionSetProvider({
	questions,
	children,
}: QuestionSetProviderProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const [answers, setAnswers] = useState<Array<number>>(
		new Array(questions.length).fill(-1),
	);

	const questionCount = questions.length;
	const answerCount = answers.filter((answer) => answer !== -1).length;
	const correctAnswerCount = answers.filter((answer) => answer === 1).length;
	const incorrectAnswerCount = answers.filter((answer) => answer === 0).length;

	return (
		<QuestionSetContext.Provider
			value={{
				currentQuestionIndex,
				questions,
				answers,
				questionCount,
				answerCount,
				correctAnswerCount,
				incorrectAnswerCount,
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
		</QuestionSetContext.Provider>
	);
}

export function useQuestionSet() {
	const context = useContext(QuestionSetContext);

	if (!context) {
		throw new Error(
			'`useQuestionSet` can only be use inside a QuestionSet component.',
		);
	}

	return context;
}
