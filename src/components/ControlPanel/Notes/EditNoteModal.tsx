import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, NoteForm } from './NoteForm';
import { Button } from '~/components/shared/Button';
import { dateFromString, formatDate } from '~/utils/transforms';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { Modal, useModal } from '~/components/shared/Modal';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { RouterOutputs, api } from '~/utils/api';
import { uploadFile } from '~/utils/uploadFile';
import { useZodForm } from '~/components/shared/Form';
import { z } from 'zod';

const editNoteSchema = z.object({
	name: z.string().min(1, 'Ingrese el nombre.'),
	date: z.string(),
	adittionalNotes: z.string().optional(),
	media: z
		.custom<FileList>()
		.optional()
		.transform((files) => files?.[0] as File | undefined)
		.refine((file) => !file || file.size <= MAX_FILE_SIZE)
		.refine(
			(file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
			'Solo se soportan formatos .pdf',
		),
	videoSrc: z.string().optional(),
	relatedLessonId: z.string().optional(),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

interface EditNoteModalProps {
	note: RouterOutputs['note']['get'];
}

export function EditNoteModal({ note }: EditNoteModalProps) {
	const editModal = useModal();

	const form = useZodForm({
		schema: editNoteSchema,
		defaultValues: {
			name: note.name,
			date: formatDate(note.date, 'yyyy-MM-dd'),
			adittionalNotes: note.adittionalNotes ?? undefined,
			relatedLessonId: note.relatedLesson?.id,
			videoSrc: note.videoSrc,
		},
	});

	const removePDFMutation = api.file.remove.useMutation({
		onError: () => {
			form.reset(form.getValues());
		},
	});
	const createSignedMutation = api.file.createPresignedUrl.useMutation({
		onError: () => {
			form.reset(form.getValues());
		},
	});

	const trpcContext = api.useUtils();

	const editNoteMutation = api.note.edit.useMutation({
		onSuccess: () => {
			trpcContext.note.get.invalidate({ id: note.id });

			form.reset();

			editModal.close();
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	async function handleSubmit(input: z.infer<typeof editNoteSchema>) {
		let fileSrc = undefined;

		if (input.media) {
			const pdfKey = note.fileSrc.split('/').pop()!;

			await removePDFMutation.mutateAsync({
				key: pdfKey,
				directory: 'files/',
				createAccessKey: input.createAccessKey,
			});

			const signedUrl = await createSignedMutation.mutateAsync({
				directory: 'files/',
				ext: input.media.name.split('.').pop()!,
				createAccessKey: input.createAccessKey,
			});

			fileSrc = await uploadFile(signedUrl, input.media);
		}
		await editNoteMutation.mutateAsync({
			noteId: note.id,
			name: input.name,
			date: dateFromString(input.date),
			adittionalNotes: input.adittionalNotes,
			fileSrc: fileSrc,
			videoSrc: input.videoSrc,
			relatedLessonId: input.relatedLessonId,
			createAccessKey: input.createAccessKey,
		});
	}

	return (
		<>
			<Button onClick={editModal.open} variant="secondary">
				<PencilSquareIcon className="mr-1 size-4" />
				<span>Editar nota</span>
			</Button>

			<Modal {...editModal.props} title="Editar nota">
				<div className="flex flex-col gap-y-4">
					<ErrorMessage
						title="No se pudo crear la nota"
						error={
							removePDFMutation.error?.message ||
							createSignedMutation.error?.message ||
							editNoteMutation.error?.message
						}
					/>

					<NoteForm
						type="edit"
						form={form}
						onSubmit={handleSubmit}
						// lessonOptions={lessonOptions}
					/>
				</div>
			</Modal>
		</>
	);
}
