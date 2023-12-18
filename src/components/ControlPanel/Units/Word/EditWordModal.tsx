import {
	ACCEPTED_IMAGE_TYPES,
	Dropzone,
	MAX_FILE_SIZE,
} from '~/components/shared/Dropzone';
import { Button } from '~/components/shared/Button';
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { Form, useZodForm } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { Modal, useModal } from '~/components/shared/Modal';
import { RadioButtonGroup } from '~/components/shared/RadioButtonGroup';
import { RouterOutputs, api } from '~/utils/api';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { uploadFile } from '~/utils/uploadFile';

const editWordSchema = z.object({
	name: z.string().min(1, 'Ingrese la palabra o frase.'),
	media: z
		.any()
		.refine((files) => (files?.[0] as File)?.size <= MAX_FILE_SIZE)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			'Solo se soportan formatos .jpg, .jpeg, .png y .webp.',
		)
		.optional(),
	tagId: z.string().min(1, 'Seleccione una etiqueta.'),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

interface EditWordModalProps {
	word: RouterOutputs['word']['get'];
}

export function EditWordModal({ word }: EditWordModalProps) {
	const router = useRouter();
	const lessonId = router.query.lessonId as string;

	const trpcContext = api.useUtils();
	const editModal = useModal();

	const form = useZodForm({
		schema: editWordSchema,
		defaultValues: {
			name: word.text,
			tagId: word.tag.id,
		},
	});

	const tagsQuery = api.tag.getAll.useQuery();

	const tags = useMemo(() => {
		if (!tagsQuery.data) {
			return [];
		}

		return tagsQuery.data.map((tag) => ({ label: tag.name, value: tag.id }));
	}, [tagsQuery.data]);

	const removeImgMutation = api.word.removeImg.useMutation({
		onError: () => {
			form.reset(form.getValues());
		},
	});

	const createSignedMutation = api.file.createPresignedUrl.useMutation({
		onError: () => {
			form.reset(form.getValues());
		},
	});

	const editWordMutation = api.word.edit.useMutation({
		onSuccess: () => {
			trpcContext.lesson.get.invalidate({ id: lessonId });
			trpcContext.word.get.invalidate({ id: word.id });

			form.reset();

			editModal.close();
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	async function handleSubmit(input: z.infer<typeof editWordSchema>) {
		let imgSrc = undefined;

		if (input.media) {
			const imgKey = word.imgSrc.split('/').pop()!;

			await removeImgMutation.mutateAsync({
				imgKey,
				directory: 'images/',
				createAccessKey: input.createAccessKey,
			});

			const signedUrl = await createSignedMutation.mutateAsync({
				directory: 'images/',
				ext: (input.media[0] as File).name.split('.').pop()!,
				createAccessKey: input.createAccessKey,
			});

			imgSrc = await uploadFile(signedUrl, input.media[0] as File);
		}

		await editWordMutation.mutateAsync({
			wordId: word.id,
			imgSrc: imgSrc,
			name: input.name,
			tagId: input.tagId,
			createAccessKey: input.createAccessKey,
		});
	}

	return (
		<>
			<Button variant="secondary" size="icon" onClick={editModal.open}>
				<PencilIcon className="h-5 w-5" />
			</Button>

			<Modal {...editModal.props} title="Editar Palabra / Frase">
				<Form form={form} onSubmit={handleSubmit}>
					<ErrorMessage
						title="No se pudo crear la unidad"
						error={
							removeImgMutation.error?.message ||
							createSignedMutation.error?.message ||
							editWordMutation.error?.message
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
						<span>Editar</span>
					</SubmitButton>
				</Form>
			</Modal>
		</>
	);
}
