import { RouterOutputs, api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { Form, useZodForm } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { Modal, useModal } from '~/components/shared/Modal';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { z } from 'zod';

const editUnitSchema = z.object({
	name: z.string().min(1, 'Ingrese el nombre de la unidad.'),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

interface EditUnitModalProps {
	unit: RouterOutputs['unit']['getAll'][number];
}

export function EditUnitModal({ unit }: EditUnitModalProps) {
	const form = useZodForm({
		schema: editUnitSchema,
		defaultValues: {
			name: unit.name,
		},
	});

	const editUnitModal = useModal();

	const trpcContext = api.useUtils();

	const editUnitMutation = api.unit.edit.useMutation({
		onSuccess: () => {
			trpcContext.unit.getAll.invalidate();

			form.reset();

			editUnitModal.close();
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	return (
		<>
			<Button variant="secondary" size="icon" onClick={editUnitModal.open}>
				<PencilIcon className="h-4 w-4" />
			</Button>

			<Modal {...editUnitModal.props} title="Editar Unidad">
				<Form
					form={form}
					onSubmit={(input) =>
						editUnitMutation.mutateAsync({
							unitId: unit.id,
							name: input.name,
							createAccessKey: input.createAccessKey,
						})
					}
				>
					<ErrorMessage
						title="No se pudo crear la unidad"
						error={editUnitMutation.error?.message}
					/>

					<Input {...form.register('name')} label="Nombre" />

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
