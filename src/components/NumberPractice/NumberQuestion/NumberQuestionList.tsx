import { AnimatePresence, Variants, motion } from 'framer-motion';
import { useNumberQuestionSet } from '../NumberQuestionSetProvider';
import { cn } from '~/utils/cn';
import { InputName } from './InputName';
import { InputNumber } from './InputNumber';

export function NumberQuestionList() {
	const { questions, currentQuestionIndex } = useNumberQuestionSet();

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
					<AnimatePresence key={`question-${questionIndex}`}>
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
								{typeof question.question === 'string' ? (
									<InputNumber questionIndex={questionIndex} />
								) : (
									<InputName questionIndex={questionIndex} />
								)}
							</motion.div>
						)}
					</AnimatePresence>
				))}
			</AnimatePresence>
		</div>
	);
}
