import { useState } from 'react';
import { useQuestionSet } from '../QuestionSetContext';
import {
	ArrowRightIcon,
	CheckIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';
import { AnimatePresence, motion } from 'framer-motion';

interface GuessImageProps {
	questionIndex: number;
}

export function GuessImage({ questionIndex }: GuessImageProps) {
	const {
		questionCount,
		answerCount,
		getQuestionByIndex,
		answerQuestion,
		goToNextQuestion,
	} = useQuestionSet();

	const question = getQuestionByIndex(questionIndex);

	const parsedAnswer = parseInt(question.answer.toString(), 10);

	const [selectedOption, setSelectedOption] = useState<number>(-1);
	const [showAnswer, setShowAnswer] = useState(false);

	function handleOptionClick(option: number) {
		setSelectedOption(option);
	}

	function handleVerifyClick() {
		setShowAnswer(true);
	}

	function handleContinueClick() {
		// TODO: Fix this

		answerQuestion(selectedOption === parsedAnswer);

		setSelectedOption(-1);
		setShowAnswer(false);

		if (answerCount < questionCount) {
			goToNextQuestion();
		}
	}

	return (
		<section className="flex h-full flex-1 flex-col gap-y-4 pt-2">
			<h1 className="text-lg font-medium">
				¿Cúal de estos es &quot;{' '}
				<span className="font-bold">{question.word.text}</span>&quot;?
			</h1>

			<div className="grid grid-cols-2 gap-2">
				{question.plausibleAnswers.map((option, optionIndex) => {
					const isSelected = optionIndex === selectedOption;

					const isAnswer = optionIndex === parsedAnswer;

					return (
						<button
							key={`option-${optionIndex}`}
							type="button"
							disabled={showAnswer}
							className={cn(
								'relative w-full overflow-hidden rounded-xl border-2 border-solid border-transparent bg-white shadow-md transition-transform hover:-translate-y-1',
								isSelected &&
									'border-brand-600 font-semibold ring-2 ring-brand-600',
							)}
							onClick={() => handleOptionClick(optionIndex)}
						>
							<div className="aspect-square w-full bg-gray-300">
								<img
									src={option}
									className="aspect-square w-full object-cover"
								/>
							</div>

							<AnimatePresence>
								{showAnswer && (
									<motion.div
										initial="initial"
										animate="animate"
										exit="exit"
										variants={{
											initial: { opacity: 0 },
											animate: { opacity: 1 },
											exit: { opacity: 0 },
										}}
										className={cn(
											'absolute inset-0 flex flex-col items-center justify-center bg-transparent',
											isAnswer
												? 'bg-green-300/80 text-green-700'
												: 'bg-rose-300/80 text-rose-700',
										)}
									>
										{isAnswer ? (
											<CheckIcon className="h-72 w-72" />
										) : (
											<XMarkIcon className="h-72 w-72" />
										)}
									</motion.div>
								)}
							</AnimatePresence>
							{/* <div
								className={cn(
									'absolute inset-0 bg-transparent',
									isSelected && 'bg-gray-200/75',
									showAnswer &&
										(isAnswer ? 'bg-green-500/75' : 'bg-rose-300/75'),
								)}
							></div> */}
						</button>
					);
				})}
			</div>

			<div className="flex-1"></div>

			<div className="flex flex-col">
				{!showAnswer && (
					<VerifyButton
						isOptionSelected={selectedOption >= 0}
						onClick={handleVerifyClick}
					/>
				)}

				{showAnswer && <ContinueButton onClick={handleContinueClick} />}
			</div>
		</section>
	);
}

interface ContinueButtonProps {
	onClick(): void;
}

function ContinueButton({ onClick }: ContinueButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				'flex h-14 items-center justify-between gap-x-2 rounded-xl bg-gray-100 px-4 py-3 text-lg font-medium text-gray-500 transition-opacity ease-in hover:opacity-75',
			)}
			onClick={onClick}
		>
			<span>Siguiente</span>
			<ArrowRightIcon className="animate-bounce-horizontal h-6 w-6" />
		</button>
	);
}

interface VerifyButtonProps {
	isOptionSelected: boolean;
	onClick(): void;
}

function VerifyButton({ isOptionSelected, onClick }: VerifyButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={!isOptionSelected}
			className={cn(
				'h-14 rounded-xl bg-gray-300 px-4 py-3 text-xl font-medium text-gray-400 shadow-sm transition-opacity hover:opacity-80',
				!isOptionSelected && 'cursor-not-allowed hover:opacity-100',
				isOptionSelected && 'bg-green-200 text-green-600',
			)}
		>
			<span>{isOptionSelected ? 'Verificar' : 'Seleccione una opción'}</span>
		</button>
	);
}
