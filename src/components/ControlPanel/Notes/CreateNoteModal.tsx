import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, NoteForm } from './NoteForm';
import { api } from '~/utils/api';
import { Button } from '../../shared/Button';
import { dateFromString } from '~/utils/transforms';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { Modal, useModal } from '../../shared/Modal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { uploadFile } from '~/utils/uploadFile';
import { useZodForm } from '../../shared/Form';
import { z } from 'zod';

const createNoteSchema = z.object({
	name: z.string().min(1, 'Ingrese el nombre.'),
	date: z.string(),
	adittionalNotes: z.string().optional(),
	media: z
		.any()
		.refine((files) => (files?.[0] as File)?.size <= MAX_FILE_SIZE)
		.refine(
			(files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
			'Solo se soportan formatos .pdf',
		),
	videoSrc: z.string().optional(),
	relatedLessonId: z.string().optional(),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

export function CreateNoteModal() {
	const createModal = useModal();

	const form = useZodForm({ schema: createNoteSchema });

	const createSignedMutation = api.file.createPresignedUrl.useMutation({
		onError: () => {
			form.clearErrors();
		},
	});

	const trpcContext = api.useUtils();

	const createNoteMutation = api.note.create.useMutation({
		onSuccess: () => {
			trpcContext.note.getAll.invalidate();
			createModal.close();
			form.reset();
		},
		onError: () => {
			form.clearErrors();
		},
	});

	async function handleSubmit(input: z.infer<typeof createNoteSchema>) {
		const signedUrl = await createSignedMutation.mutateAsync({
			directory: 'files/',
			ext: (input.media[0] as File).name.split('.').pop()!,
			createAccessKey: input.createAccessKey,
		});

		const fileSrc = await uploadFile(signedUrl, input.media[0] as File);

		const dateString = input.date.split('T')[0];

		await createNoteMutation.mutateAsync({
			name: input.name,
			date: dateFromString(dateString),
			adittionalNotes: input.adittionalNotes,
			fileSrc: fileSrc,
			videoSrc: input.videoSrc,
			relatedLessonId: input.relatedLessonId,
			createAccessKey: input.createAccessKey,
		});
	}

	return (
		<>
			<Button onClick={createModal.open}>
				<PlusCircleIcon className="mr-1 h-4 w-4" />
				<span>Añadir nota</span>
			</Button>

			<Modal {...createModal.props} title="Crear nota">
				<div className="flex flex-col gap-y-4">
					<ErrorMessage
						title="No se pudo crear la nota"
						error={
							createSignedMutation.error?.message ||
							createNoteMutation.error?.message
						}
					/>

					<NoteForm type="create" form={form} onSubmit={handleSubmit} />
				</div>
			</Modal>
		</>
	);
}
