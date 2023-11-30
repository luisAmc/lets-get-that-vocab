import { api } from '~/utils/api';
import { Button } from '../../shared/Button';
import { Form, useZodForm } from '../../shared/Form';
import { Input } from '../../shared/Input';
import { Modal, useModal } from '../../shared/Modal';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { RadioButtonGroup } from '../../shared/RadioButtonGroup';
import { SubmitButton } from '../../shared/SubmitButton';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import {
	ACCEPTED_IMAGE_TYPES,
	Dropzone,
	MAX_FILE_SIZE,
} from '../../shared/Dropzone';
import { ErrorMessage } from '../../shared/ErrorMessage';

export async function uploadFile(signedUrl: string, imageFile: File) {
	await fetch(signedUrl, {
		method: 'PUT',
		body: imageFile,
		headers: {
			'Content-Type': imageFile.type,
		},
	});

	return signedUrl.split('?')[0];
}

const createWordSchema = z.object({
	name: z.string().min(1, 'Ingrese la palabra o frase.'),
	media: z
		.any()
		.refine((files) => (files?.[0] as File)?.size <= MAX_FILE_SIZE)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			'Solo se soportan formatos .jpg, .jpeg, .png y .webp.',
		),
	tagId: z.string().min(1, 'Seleccione una etiqueta.'),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

export function CreateWordForm() {
	const router = useRouter();
	const lessonId = router.query.lessonId as string;

	const tagsQuery = api.tag.getAll.useQuery();

	const tags = useMemo(() => {
		if (!tagsQuery.data) {
			return [];
		}

		return tagsQuery.data.map((tag) => ({ label: tag.name, value: tag.id }));
	}, [tagsQuery.data]);

	const form = useZodForm({
		schema: createWordSchema,
		defaultValues: { tagId: '' },
	});

	const createWordModal = useModal();

	const trpcContext = api.useUtils();

	const createSignedMutation = api.word.createPresignedUrl.useMutation({
		onError: () => {
			form.reset(form.getValues());
		},
	});

	const createWordMutation = api.word.create.useMutation({
		onSuccess: () => {
			trpcContext.lesson.get.invalidate({
				id: lessonId,
			});
			form.reset();
			createWordModal.close();
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	async function handleSubmit(input: z.infer<typeof createWordSchema>) {
		const signedUrl = await createSignedMutation.mutateAsync({
			directory: 'images/',
			ext: (input.media[0] as File).name.split('.').pop()!,
			createAccessKey: input.createAccessKey,
		});

		const imgSrc = await uploadFile(signedUrl, input.media[0] as File);

		await createWordMutation.mutateAsync({
			imgSrc: imgSrc,
			name: input.name,
			tagId: input.tagId,
			lessonId: lessonId,
			createAccessKey: input.createAccessKey,
		});
	}

	return (
		<>
			<Button variant="secondary" onClick={createWordModal.open}>
				<PlusCircleIcon className="mr-1 h-4 w-4" />
				<span>Añadir palabra / frase</span>
			</Button>

			<Modal {...createWordModal.props} title="Crear Palabra / Frase">
				<Form form={form} onSubmit={handleSubmit}>
					<ErrorMessage
						title="No se pudo crear la unidad"
						error={
							createSignedMutation.error?.message ||
							createWordMutation.error?.message
						}
					/>

					<Input {...form.register('name')} label="Palabra o frase" />

					<Dropzone />

					<RadioButtonGroup name="tagId" label="Etiqueta" options={tags} />

					<Input
						{...form.register('createAccessKey')}
						type="password"
						label="Clave de creación"
					/>

					<SubmitButton>
						<CheckCircleIcon className="mr-1 h-4 w-4" />
						<span>Crear</span>
					</SubmitButton>
				</Form>
			</Modal>
		</>
	);
}
