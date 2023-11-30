import { PencilIcon } from '@heroicons/react/24/outline';
import { QuestionType } from '@prisma/client';
import { z } from 'zod';
import { Button } from '~/components/shared/Button';
import { Checkbox } from '~/components/shared/Checkbox';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { FieldError, Form, useZodForm } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { Modal, useModal } from '~/components/shared/Modal';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { RouterOutputs, api } from '~/utils/api';

const editLessonSchema = z
	.object({
		name: z.string().min(1, 'Ingrese el nombre de la lección.'),
		selectImage: z.boolean(),
		selectName: z.boolean(),
		selectPhrase: z.boolean(),
		inputName: z.boolean(),
		createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
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
	);

interface EditLessonModalProps {
	lesson: RouterOutputs['lesson']['get'];
}

export function EditLessonModal({ lesson }: EditLessonModalProps) {
	const form = useZodForm({
		schema: editLessonSchema,
		defaultValues: {
			name: lesson.name,
			selectImage: lesson.availableQuestionTypes.includes(
				QuestionType.SELECT_IMAGE,
			),
			selectName: lesson.availableQuestionTypes.includes(
				QuestionType.SELECT_NAME,
			),
			selectPhrase: lesson.availableQuestionTypes.includes(
				QuestionType.SELECT_PHRASE,
			),
			inputName: lesson.availableQuestionTypes.includes(
				QuestionType.INPUT_NAME,
			),
		},
	});

	const editModal = useModal();

	const trpcContext = api.useUtils();

	const editLessonMutation = api.lesson.edit.useMutation({
		onSuccess: () => {
			trpcContext.unit.getAll.invalidate();
			trpcContext.lesson.get.invalidate({ id: lesson.id });

			form.reset();

			editModal.close();
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	async function handleSubmit(input: z.infer<typeof editLessonSchema>) {
		const questionTypes = [];

		if (input.selectImage) questionTypes.push(QuestionType.SELECT_IMAGE);
		if (input.selectName) questionTypes.push(QuestionType.SELECT_NAME);
		if (input.selectPhrase) questionTypes.push(QuestionType.SELECT_PHRASE);
		if (input.inputName) questionTypes.push(QuestionType.INPUT_NAME);

		editLessonMutation.mutateAsync({
			lessonId: lesson.id,
			name: input.name,
			questionTypes,
			createAccessKey: input.createAccessKey,
		});
	}

	return (
		<>
			<Button variant="secondary" size="icon" onClick={editModal.open}>
				<PencilIcon className="h-5 w-5" />
			</Button>

			<Modal {...editModal.props} title="Nueva Lección">
				<Form form={form} onSubmit={handleSubmit}>
					<ErrorMessage
						title="No se pudo crear la unidad"
						error={editLessonMutation.error?.message}
					/>

					<Input {...form.register('name')} label="Nombre" />

					<section>
						<div className="mb-2 text-sm font-medium leading-none text-brand-800">
							Tipos de preguntas
						</div>

						<div className="mb-2 space-y-2 rounded-lg border bg-sky-50 px-4 py-3 text-sm text-sky-600">
							<span className="font-bold underline">Nota</span>

							<p>
								Esta selección describira cuales seran los tipos de preguntas
								que se podrán hacer a los usuarios en un questionario de esta
								lección.
							</p>
						</div>

						<div className="mb-2 flex flex-col gap-y-2">
							<Checkbox
								{...form.register('selectImage')}
								label="Seleccionar imagen"
								description="Se presenta una palabra y tres imagenes, el usuario selecciona la imagen que corresponda a la palabra"
							/>

							<Checkbox
								{...form.register('selectName')}
								label="Seleccionar nombre"
								description="Se presenta una imagen y tres palabras, el usuario selecciona la palabra que corresponda al nombre de la imagen"
							/>

							<Checkbox
								{...form.register('selectPhrase')}
								label="Seleccionar frase"
								description="Se presenta una situación y tres frases, el usuario selecciona la frase que corresponda a la situación"
							/>

							<Checkbox
								{...form.register('inputName')}
								label="Ingresar nombre"
								description="Se presenta una imagen, el usuario tiene que escribir la palabra o frase que corresponda a la imagen"
							/>
						</div>

						<FieldError name="availableQuestionTypes" />
					</section>

					<Input
						{...form.register('createAccessKey')}
						type="password"
						label="Clave de creación"
					/>

					<SubmitButton>Crear lección</SubmitButton>
				</Form>
			</Modal>
		</>
	);
}
