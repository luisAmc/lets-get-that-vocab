import { Button } from '../../shared/Button';
import { Checkbox } from '../../shared/Checkbox';
import { FieldError, Form, useZodForm } from '../../shared/Form';
import { Input } from '../../shared/Input';
import { Modal, useModal } from '../../shared/Modal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { SubmitButton } from '../../shared/SubmitButton';
import { z } from 'zod';
import { api } from '~/utils/api';
import { QuestionType } from '@prisma/client';
import { ErrorMessage } from '../../shared/ErrorMessage';

const createLessonSchema = z
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

interface CreateLessonFormProps {
	unitId: string;
}

export function CreateLessonForm({ unitId }: CreateLessonFormProps) {
	const form = useZodForm({ schema: createLessonSchema });

	const createModal = useModal();

	const trpcContext = api.useUtils();

	const createLessonMutation = api.lesson.create.useMutation({
		onSuccess: () => {
			trpcContext.unit.getAll.invalidate();
			form.reset();
			createModal.close();
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	async function handleSubmit(input: z.infer<typeof createLessonSchema>) {
		const questionTypes = [];

		if (input.selectImage) questionTypes.push(QuestionType.SELECT_IMAGE);
		if (input.selectName) questionTypes.push(QuestionType.SELECT_NAME);
		if (input.selectPhrase) questionTypes.push(QuestionType.SELECT_PHRASE);
		if (input.inputName) questionTypes.push(QuestionType.INPUT_NAME);

		createLessonMutation.mutateAsync({
			unitId: unitId,
			name: input.name,
			questionTypes,
			createAccessKey: input.createAccessKey,
		});
	}

	return (
		<>
			<Button variant="secondary" onClick={createModal.open}>
				<PlusCircleIcon className="h-4 w-4" />
				<span>Añadir una lección</span>
			</Button>

			<Modal {...createModal.props} title="Nueva Lección">
				<Form form={form} onSubmit={handleSubmit}>
					<ErrorMessage
						title="No se pudo crear la unidad"
						error={createLessonMutation.error?.message}
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
