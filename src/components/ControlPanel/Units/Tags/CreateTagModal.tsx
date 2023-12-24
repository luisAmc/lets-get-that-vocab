import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Form, useZodForm } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { Modal, useModal } from '~/components/shared/Modal';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { z } from 'zod';

const createTagSchema = z.object({
	name: z.string().min(1, 'Ingrese el nombre.'),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

export function CreateTagModal() {
	const createModal = useModal();

	const form = useZodForm({ schema: createTagSchema });

	const trpcContext = api.useUtils();

	const createTagMutation = api.tag.create.useMutation({
		onSuccess: () => {
			trpcContext.tag.getAll.invalidate();
			form.reset();
			createModal.close();
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	return (
		<>
			<Button variant="secondary" onClick={createModal.open}>
				<PlusCircleIcon className="mr-1 h-4 w-4" />
				<span>Añadir etiqueta</span>
			</Button>

			<Modal {...createModal.props} title="Crear Etiqueta">
				<Form
					form={form}
					onSubmit={(input) =>
						createTagMutation.mutateAsync({
							name: input.name,
							createAccessKey: input.createAccessKey,
						})
					}
				>
					<Input {...form.register('name')} label="Nombre" />

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
