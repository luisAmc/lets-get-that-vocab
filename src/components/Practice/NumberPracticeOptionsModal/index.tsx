import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { Modal, ModalProps } from '~/components/shared/Modal';
import { Form, useZodForm } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { RANGES, RangeCardGroup } from './RangeCardGroup';
import { QUESTION_TYPES, QuestionTypeGroup } from './QuestionTypeGroup';
import { NUMBER_TYPES, NumberTypeGroup } from './NumberTypeGroup';
import { useWatch } from 'react-hook-form';

interface NumberPracticeOptionsModalProps
	extends Omit<ModalProps, 'title' | 'children'> {}

const numberPracticeOptionsSchema = z.object({
	questionSetSize: z
		.number()
		.int('Tiene que ser un número entero.')
		.positive('Tiene que ser un número positivo.'),
	numberType: z.nativeEnum(NUMBER_TYPES),
	range: z.nativeEnum(RANGES),
	questionType: z.nativeEnum(QUESTION_TYPES),
});

export function NumberPracticeOptionsModal({
	open,
	onClose,
}: NumberPracticeOptionsModalProps) {
	const router = useRouter();

	const form = useZodForm({
		schema: numberPracticeOptionsSchema,
		defaultValues: {
			questionSetSize: 10,
			numberType: NUMBER_TYPES['한자어 수'],
			range: RANGES['1TO99'],
			questionType: QUESTION_TYPES.INPUT_NUMBER,
		},
	});

	const numberType = useWatch({ control: form.control, name: 'numberType' });

	return (
		<Modal title="Antes de continuar..." open={open} onClose={onClose}>
			<Form
				form={form}
				onSubmit={(input) => {
					router.push({
						pathname: 'number-practice',
						query: {
							numberType: input.numberType,
							questionSetSize: input.questionSetSize,
							range: input.range,
							questionType: input.questionType,
						},
					});
				}}
			>
				<Input
					{...form.register('questionSetSize', { valueAsNumber: true })}
					label="¿Cuántas preguntas?"
					placeholder="Ejemplo: 10"
					inputMode="numeric"
					onWheel={(event) =>
						event.target instanceof HTMLElement && event.target.blur()
					}
				/>

				<NumberTypeGroup />

				{numberType === NUMBER_TYPES['한자어 수'] && <RangeCardGroup />}

				<QuestionTypeGroup />

				<SubmitButton>
					<CheckCircleIcon className="mr-1 h-4 w-4" />
					<span>Comenzar</span>
				</SubmitButton>
			</Form>
		</Modal>
	);
}
