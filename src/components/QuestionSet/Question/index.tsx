import { GuessImage } from './GuessImage';
import { GuessName } from './GuessName';
import { InputName } from './InputName';
import { QuestionType } from '@prisma/client';
import { ReactNode } from 'react';
import { useQuestionSet } from '../QuestionSetContext';

const QuestionComponent: Record<QuestionType, ReactNode> = {
	SELECT_NAME: <GuessName />,
	SELECT_IMAGE: <GuessImage />,
	SELECT_PHRASE: null,
	INPUT_NAME: <InputName />,
};

export function Question() {
	const { getCurrentQuestion } = useQuestionSet();

	const question = getCurrentQuestion();

	return QuestionComponent[question.type as QuestionType];
}
