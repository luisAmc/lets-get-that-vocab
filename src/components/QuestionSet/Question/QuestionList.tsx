import { AnimatePresence, Variants, motion } from 'framer-motion';
import { GuessImage } from './GuessImage';
import { GuessName } from './GuessName';
import { GuessPhrase } from './GuessPhrase';
import { InputName } from './InputName';
import { QuestionType } from '@prisma/client';
import { useQuestionSet } from '../QuestionSetContext';
import { cn } from '~/utils/cn';

export function QuestionList() {
	const { questions, currentQuestionIndex } = useQuestionSet();

	const variants: Variants = {
		initial: {
			opacity: 0,
			y: -20,
			transition: { duration: 0.3 },
		},
		animate: { opacity: 1, y: 0 },
		exit: {
			opacity: 0,
			x: -500,
			y: 40,
			transition: { duration: 0.3 },
		},
	};

	return (
		<div className="relative h-full">
			<AnimatePresence mode="wait">
				{questions.map((question, questionIndex) => (
					<AnimatePresence key={question.word.text}>
						{questionIndex === currentQuestionIndex && (
							<motion.div
								initial="initial"
								animate="animate"
								exit="exit"
								variants={variants}
								className={cn(
									'absolute h-full w-full rounded-xl border border-brand-200 bg-white p-4',
								)}
							>
								{
									{
										[QuestionType.SELECT_IMAGE]: (
											<GuessImage questionIndex={questionIndex} />
										),
										[QuestionType.SELECT_NAME]: (
											<GuessName questionIndex={questionIndex} />
										),
										[QuestionType.SELECT_PHRASE]: (
											<GuessPhrase questionIndex={questionIndex} />
										),
										[QuestionType.INPUT_NAME]: (
											<InputName questionIndex={questionIndex} />
										),
									}[question.type as QuestionType]
								}
							</motion.div>
						)}
					</AnimatePresence>
				))}
			</AnimatePresence>
		</div>
	);
}
