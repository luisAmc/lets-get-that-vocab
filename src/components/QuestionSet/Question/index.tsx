import { useQuestionSet } from '../QuestionSetContext';
import { type QUESTION_TYPE } from '../../../utils/generateQuestionSet';
import { GuessName } from './GuessName';
import { ReactNode } from 'react';
import { GuessImage } from './GuessImage';
import { InputName } from './InputName';

const QuestionComponent: Record<QUESTION_TYPE, ReactNode> = {
    GUESS_NAME_A: <GuessName />,
    GUESS_NAME_B: <GuessName />,
    GUESS_IMAGE: <GuessImage />,
    INPUT_NAME: <InputName />,
};

export function Question() {
    const { getCurrentQuestion } = useQuestionSet();

    const question = getCurrentQuestion();

    return QuestionComponent[question.type];
}
