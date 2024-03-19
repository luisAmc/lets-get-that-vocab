import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '~/utils/cn';
import { FieldError, Form, useZodForm } from '../shared/Form';
import { Input } from '../shared/Input';
import { Modal, ModalProps } from '../shared/Modal';
import { RadioGroup } from '@headlessui/react';
import { SubmitButton } from '../shared/SubmitButton';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/router';

interface NumberPracticeOptionsModalProps
	extends Omit<ModalProps, 'title' | 'children'> {}

const RANGES = {
	'1TO99': '1TO99',
	'100TO9_999': '100TO9_999',
	'10KTO100M': '10KTO100M',
	'1TO100M': '1TO100M',
} as const;

const RANGE_OPTIONS = [
	{ label: '1 - 99', value: RANGES['1TO99'] },
	{ label: '100 - 9,999', value: RANGES['100TO9_999'] },
	{ label: '10K - 100M', value: RANGES['10KTO100M'] },
	{ label: '1 - 100M', value: RANGES['1TO100M'] },
] as const;

const QUESTION_TYPES = {
	INPUT_NAME: 'inputName',
	BOTH: 'both',
	INPUT_NUMBER: 'inputNumber',
} as const;

const QUESTION_TYPE_OPTIONS = [
	{ label: 'Ingresar nombre', value: QUESTION_TYPES.INPUT_NAME },
	{ label: 'Ambos', value: QUESTION_TYPES.BOTH },
	{ label: 'Ingresar número', value: QUESTION_TYPES.INPUT_NUMBER },
] as const;

const numberPracticeOptionsSchema = z.object({
	questionSetSize: z
		.number()
		.int('Tiene que ser un número entero.')
		.positive('Tiene que ser un número positivo.'),
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
			range: RANGES['1TO99'],
			questionType: QUESTION_TYPES.INPUT_NUMBER,
		},
	});

	return (
		<Modal title="Antes de continuar..." open={open} onClose={onClose}>
			<Form
				form={form}
				onSubmit={(input) => {
					router.push({
						pathname: 'number-practice',
						query: {
							questionSetSize: input.questionSetSize,
							range: input.range,
							questionType: input.questionType,
						},
					});
				}}
			>
				<Input
					{...form.register('questionSetSize', { valueAsNumber: true })}
					label="¿Con cuantos números practicar?"
					placeholder="Ejemplo: 10"
					inputMode="numeric"
					onWheel={(event) =>
						event.target instanceof HTMLElement && event.target.blur()
					}
				/>

				<RangeCardGroup
					name="range"
					label="¿Qué rango practicar?"
					options={RANGE_OPTIONS}
				/>

				<QuestionTypeGroup
					name="questionType"
					label="¿Cómo practicar?"
					options={QUESTION_TYPE_OPTIONS}
				/>

				<SubmitButton>
					<CheckCircleIcon className="mr-1 h-4 w-4" />
					<span>Comenzar</span>
				</SubmitButton>
			</Form>
		</Modal>
	);
}

interface RangeCardGroupProps {
	name: string;
	label: string;
	options: Readonly<Array<{ label: string; value: string }>>;
}

function RangeCardGroup({ name, label, options }: RangeCardGroupProps) {
	const {
		field: { value, onChange },
	} = useController({ name });

	return (
		<label>
			<div className="mb-2 text-sm font-medium leading-none text-brand-800">
				{label}
			</div>

			<RadioGroup
				value={value}
				onChange={onChange}
				className="grid grid-cols-2 gap-1"
			>
				{options.map((option) => (
					<RadioGroup.Option
						key={`radio-card-${option.value}`}
						value={option.value}
						className={({ checked }) =>
							cn(
								checked
									? 'border-brand-600 ring-2 ring-brand-600'
									: 'border-gray-300',
								'relative flex h-32 cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none',
							)
						}
					>
						{({ active, checked }) => (
							<>
								<span className="flex flex-1 flex-col items-center justify-center gap-y-2">
									<CheckCircleIcon
										className={cn(
											'size-10',
											checked ? 'text-brand-600' : 'text-gray-100',
										)}
										aria-hidden="true"
									/>

									<RadioGroup.Label className="text-center text-lg font-semibold">
										{option.label}
									</RadioGroup.Label>
								</span>

								<span
									className={cn(
										active ? 'border' : 'border-2',
										checked ? 'border-brand-600' : 'border-transparent',
										'pointer-events-none absolute -inset-px rounded-lg',
									)}
									aria-hidden="true"
								/>
							</>
						)}
					</RadioGroup.Option>
				))}
			</RadioGroup>

			<FieldError name={name} />
		</label>
	);
}

interface QuestionTypeGroupProps {
	name: string;
	label: string;
	options: Readonly<Array<{ label: string; value: string }>>;
}

function QuestionTypeGroup({ name, label, options }: QuestionTypeGroupProps) {
	const {
		field: { value, onChange },
	} = useController({ name });

	return (
		<label>
			<div className="mb-2 text-sm font-medium leading-none text-brand-800">
				{label}
			</div>

			<RadioGroup
				value={value}
				onChange={onChange}
				className="grid grid-cols-3 rounded-lg bg-gray-100 p-1.5"
			>
				{options.map((option) => (
					<RadioGroup.Option
						key={`radio-card-${option.value}`}
						value={option.value}
						className={({ checked }) =>
							cn(
								'flex items-center justify-center rounded-lg px-4 py-2 text-center text-sm font-semibold text-gray-500 focus:outline-none',
								checked
									? 'border-brand-600 bg-white ring-2 ring-brand-600'
									: 'border-gray-300',
							)
						}
					>
						<RadioGroup.Label>{option.label}</RadioGroup.Label>
					</RadioGroup.Option>
				))}
			</RadioGroup>

			<FieldError name={name} />
		</label>
	);
}
