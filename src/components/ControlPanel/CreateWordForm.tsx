import { api } from '~/utils/api';
import { Button } from '../shared/Button';
import { Form, useZodForm } from '../shared/Form';
import { Input } from '../shared/Input';
import { Modal, useModal } from '../shared/Modal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { RadioButtonGroup } from '../shared/RadioButtonGroup';
import { SubmitButton } from '../shared/SubmitButton';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import {
	ACCEPTED_IMAGE_TYPES,
	Dropzone,
	MAX_FILE_SIZE,
} from '../shared/Dropzone';

async function uploadFile(signedUrl: string, imageFile: File) {
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
	// imgSrc: z.string().min(1, 'Ingrese el link de la imagen correspondiente.'),
	tagId: z.string().min(1, 'Seleccione una etiqueta.'),
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

	const createSignedMutation = api.word.createPresignedUrl.useMutation();

	const createWordMutation = api.word.create.useMutation({
		onSuccess: () => {
			trpcContext.lesson.get.invalidate({
				id: lessonId,
			});
			form.reset();
			createWordModal.close();
		},
	});

	async function handleSubmit(input: z.infer<typeof createWordSchema>) {
		const signedUrl = await createSignedMutation.mutateAsync({
			directory: 'images/',
			ext: (input.media[0] as File).name.split('.').pop()!,
		});

		const imgSrc = await uploadFile(signedUrl, input.media[0] as File);

		await createWordMutation.mutateAsync({
			imgSrc: imgSrc,
			name: input.name,
			tagId: input.tagId,
			lessonId: lessonId,
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
					<Input {...form.register('name')} label="Palabra o frase" />

					<Dropzone />

					<RadioButtonGroup name="tagId" label="Etiqueta" options={tags} />

					<SubmitButton>Crear palabra / frase</SubmitButton>
				</Form>
			</Modal>
		</>
	);
}
