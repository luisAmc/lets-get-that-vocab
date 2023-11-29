import { useState } from 'react';
import { useQuestionSet } from '../QuestionSetContext';
import { Button } from '~/components/shared/Button';
import {
	ArrowRightIcon,
	CheckIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { Pill } from '~/components/shared/Pill';
import { cn } from '~/utils/cn';

interface GuessPhraseProps {
	questionIndex: number;
}

export function GuessPhrase({ questionIndex }: GuessPhraseProps) {
	const {
		questionCount,
		answerCount,
		getQuestionByIndex,
		answerQuestion,
		goToNextQuestion,
	} = useQuestionSet();

	const question = getQuestionByIndex(questionIndex);

	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [showAnswer, setShowAnswer] = useState(false);

	function handleOptionClick(option: string) {
		setSelectedOption(option);
	}

	function handleVerifyClick() {
		setShowAnswer(true);
	}

	function handleContinueClick() {
		answerQuestion(selectedOption === question.answer);

		setSelectedOption(null);
		setShowAnswer(false);

		if (answerCount < questionCount) {
			goToNextQuestion();
		}
	}

	const isAnswer = selectedOption === question.answer;

	return (
		<section className="flex h-full flex-1 flex-col gap-y-4 pt-2">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-medium">
					¿Cúal frase aplica a esta imagen?
				</h1>

				<Pill>{question.word.tag.name}</Pill>
			</div>

			<div className="relative overflow-hidden rounded-xl">
				{/* <div className="aspect-square w-full bg-gray-300 ">
					<img
						className="aspect-square h-full object-cover"
						src={question.word.imgSrc}
					/>
				</div> */}

				<div className="h-42 w-full bg-gray-300 sm:aspect-square sm:h-auto">
					<img
						className="h-full sm:aspect-square sm:w-full sm:object-cover"
						src={question.word.imgSrc}
					/>
				</div>

				{/* <div className="h-42 w-full bg-gray-300 sm:aspect-square sm:h-auto">
					<img
						className="sm:aspect-square sm:h-full sm:object-cover"
						src={question.word.imgSrc}
					/>
				</div> */}

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
								'absolute inset-0 flex flex-col items-center justify-center bg-transparent p-4',
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

							<span className="text-4xl font-bold sm:text-5xl">
								{question.answer}
							</span>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="flex flex-col items-center gap-2.5">
				{question.plausibleAnswers.map((option) => (
					<button
						key={`option-${option}`}
						type="button"
						disabled={showAnswer}
						className={cn(
							'w-full rounded-xl border-2 border-transparent bg-brand-50 px-8 py-3 text-left text-2xl text-brand-900 shadow-md transition-[opacity,_colors] hover:bg-brand-300',
							option === selectedOption &&
								'border-brand-600 bg-brand-300 font-semibold ring-2 ring-brand-600',
							showAnswer &&
								(question.answer === option
									? 'bg-green-500 font-bold text-green-800'
									: 'bg-rose-300 text-rose-700'),
						)}
						onClick={() => handleOptionClick(option)}
					>
						<span>{option}</span>
					</button>
				))}
			</div>

			<div className="flex-1"></div>

			<div className="flex flex-col">
				{!showAnswer && (
					<VerifyButton
						isOptionSelected={Boolean(selectedOption)}
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
		<Button
			size="xl"
			variant="secondary"
			className="flex items-center justify-between"
			onClick={onClick}
		>
			<span>Siguiente</span>
			<ArrowRightIcon className="animate-bounce-horizontal h-6 w-6" />
		</Button>
	);
}

interface VerifyButtonProps {
	isOptionSelected: boolean;
	onClick(): void;
}

function VerifyButton({ isOptionSelected, onClick }: VerifyButtonProps) {
	return (
		<>
			<Button
				size="xl"
				variant={isOptionSelected ? 'positive' : 'secondary'}
				onClick={onClick}
				disabled={!isOptionSelected}
			>
				<span>{isOptionSelected ? 'Verificar' : 'Seleccione una opción'}</span>
			</Button>
		</>
	);
}
