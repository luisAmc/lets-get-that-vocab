import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import {
	ArrowRightIcon,
	CheckIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { Form, useZodForm } from '~/components/shared/Form';
import { z } from 'zod';
import { useWatch } from 'react-hook-form';
import { useNumberQuestionSet } from '../NumberQuestionSetProvider';
import { formatNumber } from '~/utils/transforms';
import { SubmitButton } from '~/components/shared/SubmitButton';

const inputNameSchema = z.object({
	input: z.string().min(1, 'Ingrese el nombre'),
});

interface InputNameProps {
	questionIndex: number;
}

export function InputNumber({ questionIndex }: InputNameProps) {
	const {
		questionsCount,
		answersCount,
		getQuestionByIndex,
		answerQuestion,
		goToNextQuestion,
		playCorrectSfx,
		playIncorrectSfx,
	} = useNumberQuestionSet();

	const question = getQuestionByIndex(questionIndex);

	const form = useZodForm({ schema: inputNameSchema });

	const numberEntered = useWatch({ control: form.control, name: 'input' });

	const [showAnswer, setShowAnswer] = useState(false);

	function handleVerifyClick() {
		if (isAnswer) {
			playCorrectSfx();
		} else {
			playIncorrectSfx();
		}

		setShowAnswer(true);
	}

	function handleContinueClick() {
		answerQuestion(numberEntered === question.answer);

		setShowAnswer(false);

		if (answersCount < questionsCount) {
			goToNextQuestion();
		}
	}

	const isAnswer = numberEntered === question.answer;

	return (
		<section className="flex h-full flex-1 flex-col gap-y-4 pt-2">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-medium">
					¿A qué número corresponde este nombre?
				</h1>
			</div>

			<div className="relative overflow-hidden rounded-xl">
				<div
					className={cn(
						'flex h-52 items-center justify-center bg-gray-100 p-4 font-bold',
						question.question.toString().length > 13 ? 'text-2xl' : 'text-3xl',
					)}
				>
					{question.question}
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
								'absolute inset-0 flex flex-col items-center justify-center bg-transparent p-2',
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

							<span className="text-5xl font-bold">
								{formatNumber(question.answer as number)}
							</span>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<Form form={form} onSubmit={handleVerifyClick}>
				<div className="flex h-full flex-col gap-y-4">
					<input
						{...form.register('input', { valueAsNumber: true })}
						type="number"
						// inputMode="numeric"
						className={cn(
							'h-14 w-full rounded-xl border-2 border-solid border-transparent px-4 py-2 text-center text-xl text-gray-900 ring-2',
							'focus:border-yellow-primary focus:ring-yellow-primary focus:outline-none',
							showAnswer &&
								(isAnswer
									? 'bg-green-300 text-green-700'
									: 'bg-rose-300 text-rose-700'),
						)}
						placeholder="Escribe aquí..."
					/>

					{!showAnswer && (
						<VerifyButton
							isOptionSelected={Boolean(numberEntered)}
							onClick={handleVerifyClick}
						/>
					)}

					{showAnswer && <ContinueButton onClick={handleContinueClick} />}
				</div>
			</Form>
		</section>
	);
}

interface ContinueButtonProps {
	onClick(): void;
}

function ContinueButton({ onClick }: ContinueButtonProps) {
	return (
		<SubmitButton
			size="xl"
			variant="secondary"
			className="flex items-center justify-between"
			onClick={onClick}
		>
			<span>Siguiente</span>
			<ArrowRightIcon className="animate-bounce-horizontal h-6 w-6" />
		</SubmitButton>
	);
}

interface VerifyButtonProps {
	isOptionSelected: boolean;
	onClick(): void;
}

function VerifyButton({ isOptionSelected, onClick }: VerifyButtonProps) {
	return (
		<>
			<SubmitButton
				size="xl"
				variant={isOptionSelected ? 'positive' : 'secondary'}
				onClick={onClick}
				disabled={!isOptionSelected}
			>
				<span>{isOptionSelected ? 'Verificar' : 'Seleccione una opción'}</span>
			</SubmitButton>
		</>
	);
}
