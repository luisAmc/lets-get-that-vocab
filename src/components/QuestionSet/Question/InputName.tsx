import { useState } from 'react';
import { useQuestionSet } from '../QuestionSetContext';
import { cn } from '../../../utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import {
	ArrowRightIcon,
	CheckIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { Pill } from '~/components/shared/Pill';
import { Button } from '~/components/shared/Button';
import { Form, useZodForm } from '~/components/shared/Form';
import { z } from 'zod';
import { useWatch } from 'react-hook-form';

const inputNameSchema = z.object({
	input: z.string().min(1, 'Ingrese el nombre'),
});

interface InputNameProps {
	questionIndex: number;
}

export function InputName({ questionIndex }: InputNameProps) {
	const {
		questionCount,
		answerCount,
		getQuestionByIndex,
		answerQuestion,
		goToNextQuestion,
	} = useQuestionSet();

	const question = getQuestionByIndex(questionIndex);

	const form = useZodForm({ schema: inputNameSchema });

	const nameEntered = useWatch({ control: form.control, name: 'input' });

	const [showAnswer, setShowAnswer] = useState(false);

	function handleVerifyClick() {
		console.log({ nameEntered });
		setShowAnswer(true);
	}

	function handleContinueClick() {
		answerQuestion(nameEntered.trim() === question.answer);

		setShowAnswer(false);

		if (answerCount < questionCount) {
			goToNextQuestion();
		}
	}

	const isAnswer = nameEntered === question.answer;

	return (
		<section className="flex h-full flex-1 flex-col gap-y-4 pt-2">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-medium">Escribe el nombre</h1>

				<Pill>{question.word.tag.name}</Pill>
			</div>

			<div className="relative overflow-hidden rounded-xl">
				<div className="aspect-square w-full bg-gray-300">
					<img
						className="aspect-square w-full object-cover"
						src={question.word.imgSrc}
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

							<span className="text-5xl font-bold">{question.answer}</span>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="flex-1"></div>

			<div>
				<Form form={form} onSubmit={handleVerifyClick}>
					<input
						{...form.register('input')}
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
							isOptionSelected={Boolean(nameEntered)}
							onClick={handleVerifyClick}
						/>
					)}

					{showAnswer && <ContinueButton onClick={handleContinueClick} />}
				</Form>
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
