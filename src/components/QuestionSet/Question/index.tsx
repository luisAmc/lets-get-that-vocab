import { GuessImage } from './GuessImage';
import { GuessName } from './GuessName';
import { InputName } from './InputName';
import { QuestionType } from '@prisma/client';
import { ReactNode } from 'react';
import { useQuestionSet } from '../QuestionSetContext';
import { AnimatePresence, motion } from 'framer-motion';

const QuestionComponent: Record<QuestionType, ReactNode> = {
	SELECT_NAME: <GuessName />,
	SELECT_IMAGE: <GuessImage />,
	SELECT_PHRASE: null,
	INPUT_NAME: <InputName />,
};

export function Question() {
	const { getCurrentQuestion } = useQuestionSet();

	const question = getCurrentQuestion();

	return (
		<div className="h-full">
			<AnimatePresence mode="wait">
				<motion.div
					key={`question-${question.word.text}`}
					initial="initial"
					animate="animate"
					exit="exit"
					variants={{
						initial: { opacity: 0, y: -20, transition: { duration: 0.3 } },
						animate: { opacity: 1, y: 0 },
						exit: { opacity: 0, x: -500, y: 40, transition: { duration: 0.3 } },
					}}
					className="relative h-full w-full rounded-xl border border-brand-200 bg-white p-4"
				>
					{QuestionComponent[question.type as QuestionType]}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
