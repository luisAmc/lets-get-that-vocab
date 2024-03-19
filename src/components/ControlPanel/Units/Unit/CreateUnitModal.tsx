import { api } from '~/utils/api';
import { Button } from '../../../shared/Button';
import { Form, useZodForm } from '../../../shared/Form';
import { Input } from '../../../shared/Input';
import { Modal, useModal } from '../../../shared/Modal';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { SubmitButton } from '../../../shared/SubmitButton';
import { z } from 'zod';
import { ErrorMessage } from '../../../shared/ErrorMessage';

const createUnitSchema = z.object({
	name: z.string().min(1, 'Ingrese el nombre de la unidad.'),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

export function CreateUnitModal() {
	const form = useZodForm({ schema: createUnitSchema });

	const createUnitModal = useModal();

	const trpcContext = api.useUtils();

	const createUnitMutation = api.unit.create.useMutation({
		onSuccess: () => {
			trpcContext.unit.getAll.invalidate();

			form.reset();

			createUnitModal.close();
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	return (
		<>
			<Button
				variant="dashed"
				onClick={createUnitModal.open}
				className="h-20 w-full"
			>
				<PlusCircleIcon className="mr-1 size-4" />
				<span>Añadir una unidad</span>
			</Button>

			<Modal {...createUnitModal.props} title="Crear Unidad">
				<Form
					form={form}
					onSubmit={(input) =>
						createUnitMutation.mutateAsync({
							name: input.name,
							createAccessKey: input.createAccessKey,
						})
					}
				>
					<ErrorMessage
						title="No se pudo crear la unidad"
						error={createUnitMutation.error?.message}
					/>
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
