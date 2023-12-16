import { z } from 'zod';
import { Form, useZodForm } from '../shared/Form';
import { Button } from '../shared/Button';
import { Modal, useModal } from '../shared/Modal';
import { ErrorMessage } from '../shared/ErrorMessage';
import { Input } from '../shared/Input';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { SubmitButton } from '../shared/SubmitButton';
import { api } from '~/utils/api';
import { uploadFile } from '~/utils/uploadFile';
import { dateFromString } from '~/utils/transforms';

const MAX_FILE_SIZE = 1 * 1000 * 1000 * 10; //10MB

const ACCEPTED_FILE_TYPES = ['application/pdf'];

const createNoteSchema = z.object({
	name: z.string().min(1, 'Ingrese el nombre.'),
	date: z.string(),
	adittionalNotes: z.string().optional(),
	media: z
		.any()
		.refine((files) => (files?.[0] as File)?.size <= MAX_FILE_SIZE)
		.refine((files) => {
			console.log({ files });
			return ACCEPTED_FILE_TYPES.includes(files?.[0]?.type);
		}, 'Solo se soportan formatos .pdf'),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

export function CreateNoteModal() {
	const createModal = useModal();

	const form = useZodForm({ schema: createNoteSchema });

	const createSignedMutation = api.file.createPresignedUrl.useMutation({
		onError: () => {
			form.reset(form.getValues());
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
			form.reset(form.getValues());
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
			createAccessKey: input.createAccessKey,
		});
	}

	return (
		<>
			<Button variant="secondary" onClick={createModal.open}>
				<PlusCircleIcon className="mr-1 h-4 w-4" />
				<span>Añadir nota</span>
			</Button>

			<Modal {...createModal.props} title="Crear nota">
				<Form form={form} onSubmit={handleSubmit}>
					<ErrorMessage
						title="No se pudo crear la nota"
						error={
							createSignedMutation.error?.message ||
							createNoteMutation.error?.message
						}
					/>

					<Input {...form.register('name')} label="Nombre" />

					<Input {...form.register('date')} label="Fecha" type="date" />

					<Input
						{...form.register('adittionalNotes')}
						label="Notas adicionales (Opcional)"
					/>

					<Input
						{...form.register('media')}
						label="Media (PDF)"
						type="file"
						accept="application/pdf"
					/>

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
