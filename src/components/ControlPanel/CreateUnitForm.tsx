import { api } from '~/utils/api';
import { Button } from '../shared/Button';
import { Form, useZodForm } from '../shared/Form';
import { Input } from '../shared/Input';
import { Modal, useModal } from '../shared/Modal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { SubmitButton } from '../shared/SubmitButton';
import { z } from 'zod';

const createUnitSchema = z.object({
	name: z.string().min(1, 'Ingrese el nombre de la unidad.'),
});

export function CreateUnitForm() {
	const form = useZodForm({ schema: createUnitSchema });

	const createUnitModal = useModal();

	const trpcContext = api.useUtils();

	const createUnitMutation = api.unit.create.useMutation({
		onSuccess: () => {
			trpcContext.unit.getAll.invalidate();

			form.reset();

			createUnitModal.close();
		},
	});

	return (
		<>
			<Button variant="secondary" onClick={createUnitModal.open}>
				<PlusCircleIcon className="mr-1 h-4 w-4" />
				<span>Añadir una unidad</span>
			</Button>

			<Modal {...createUnitModal.props} title="Crear Unidad">
				<Form
					form={form}
					onSubmit={(input) =>
						createUnitMutation.mutateAsync({ name: input.name })
					}
				>
					<Input {...form.register('name')} label="Nombre" />

					<SubmitButton>Crear unidad</SubmitButton>
				</Form>
			</Modal>
		</>
	);
}
