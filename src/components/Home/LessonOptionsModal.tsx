import { Button } from '../shared/Button';
import { Checkbox } from '../shared/Checkbox';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { FieldError, Form, useZodForm } from '../shared/Form';
import { Modal, ModalProps } from '../shared/Modal';
import { RouterOutputs } from '~/utils/api';
import { z } from 'zod';
import { QuestionType } from '@prisma/client';
import { useEffect } from 'react';
import { SubmitButton } from '../shared/SubmitButton';
import { useRouter } from 'next/router';
import { inputVariants } from '../shared/Input';

export type LessonType =
	RouterOutputs['unit']['getAll'][number]['lessons'][number];

const fieldNameByQuestionType: Record<string, string> = {
	[QuestionType.SELECT_IMAGE]: 'selectImage',
	[QuestionType.SELECT_NAME]: 'selectName',
	[QuestionType.SELECT_PHRASE]: 'selectPhrase',
	[QuestionType.INPUT_NAME]: 'inputName',
};

interface LessonOptionsModalProps
	extends Omit<ModalProps, 'title' | 'children'> {
	lesson: LessonType;
}

export function LessonOptionsModal({
	lesson,
	open,
	onClose,
}: LessonOptionsModalProps) {
	const router = useRouter();

	const form = useZodForm({
		schema: z
			.object({
				questionSetSize: z
					.number()
					.int('Tiene que ser un número entero.')
					.positive('Tiene que ser un número positivo.')
					.max(
						lesson._count.words,
						`La cantidad maxima de preguntas es la misma a la cantidad de palabras.`,
					),
				selectImage: z.boolean().optional(),
				selectName: z.boolean().optional(),
				selectPhrase: z.boolean().optional(),
				inputName: z.boolean().optional(),
			})
			.refine(
				(data) =>
					data.selectImage ||
					data.selectName ||
					data.selectPhrase ||
					data.inputName,
				{
					message: 'Seleccione un tipo de pregunta',
					path: ['availableQuestionTypes'],
				},
			),
	});

	useEffect(() => {
		let defaultValues: Record<string, number | boolean> = {
			questionSetSize: Math.min(10, lesson._count.words),
		};

		for (const type of lesson.availableQuestionTypes) {
			const key = fieldNameByQuestionType[type as string];
			defaultValues[key] = true;
		}

		form.reset(defaultValues);
	}, [lesson]);

	const availableQuestionTypes = lesson.availableQuestionTypes;

	return (
		<Modal title="Antes de continuar..." open={open} onClose={onClose}>
			<div className="flex flex-col gap-y-4">
				<Form
					form={form}
					onSubmit={(input) => {
						const selectedQuestionTypes = Object.keys(input).filter(
							(field) =>
								field !== 'questionSetSize' &&
								input[field as keyof typeof input],
						);

						router.push({
							pathname: 'question-set',
							query: {
								lessonId: lesson.id,
								questionSetSize: input.questionSetSize,
								questionTypes: selectedQuestionTypes.join(','),
							},
						});
					}}
				>
					<label>
						<div className="mb-2 text-sm font-medium leading-none text-gray-800">
							Cantidad de preguntas
						</div>

						<div className="flex items-center gap-x-2 rounded-lg bg-gray-300 pr-4">
							<input
								{...form.register('questionSetSize', { valueAsNumber: true })}
								className={inputVariants({ className: 'flex-1' })}
								type="number"
								onWheel={(event) =>
									event.target instanceof HTMLElement && event.target.blur()
								}
							/>

							<span className="flex-0 flex items-center gap-x-1 text-sm">
								<span>de</span>
								<span>{lesson._count.words}</span>
								<span>palabras</span>
							</span>
						</div>

						<FieldError name="questionSetSize" />
					</label>

					<section>
						<p className="mb-2 text-sm font-medium leading-none text-gray-800">
							¿Con qué tipos de preguntas quieres practicar?
						</p>

						<div className="mb-2 flex flex-col gap-y-2">
							{availableQuestionTypes.includes(QuestionType.SELECT_IMAGE) && (
								<Checkbox
									{...form.register('selectImage')}
									label="Seleccionar imagen"
									description="Se presenta una palabra y tres imagenes, el usuario selecciona la imagen que corresponda a la palabra"
								/>
							)}

							{availableQuestionTypes.includes(QuestionType.SELECT_NAME) && (
								<Checkbox
									{...form.register('selectName')}
									label="Seleccionar nombre"
									description="Se presenta una imagen y tres palabras, el usuario selecciona la palabra que corresponda al nombre de la imagen"
								/>
							)}

							{availableQuestionTypes.includes(QuestionType.SELECT_PHRASE) && (
								<Checkbox
									{...form.register('selectPhrase')}
									label="Seleccionar frase"
									description="Se presenta una situación y tres frases, el usuario selecciona la frase que corresponda a la situación"
								/>
							)}

							{availableQuestionTypes.includes(QuestionType.INPUT_NAME) && (
								<Checkbox
									{...form.register('inputName')}
									label="Ingresar nombre"
									description="Se presenta una imagen, el usuario tiene que escribir la palabra o frase que corresponda a la imagen"
								/>
							)}
						</div>

						<FieldError name="availableQuestionTypes" />
					</section>

					<SubmitButton>
						<CheckCircleIcon className="mr-1 h-4 w-4" />
						<span>Comenzar</span>
					</SubmitButton>
				</Form>
			</div>
		</Modal>
	);
}
