import { cn } from '~/utils/cn';
import { FieldError } from '~/components/shared/Form';
import { RadioGroup } from '@headlessui/react';
import { useController } from 'react-hook-form';

export const QUESTION_TYPES = {
	INPUT_NAME: 'inputName',
	BOTH: 'both',
	INPUT_NUMBER: 'inputNumber',
} as const;

const QUESTION_TYPE_OPTIONS = [
	{ label: 'Ingresar número', value: QUESTION_TYPES.INPUT_NUMBER },
	{ label: 'Ambos', value: QUESTION_TYPES.BOTH },
	{ label: 'Ingresar nombre', value: QUESTION_TYPES.INPUT_NAME },
] as const;

const FIELD_NAME = 'questionType';

export function QuestionTypeGroup() {
	const {
		field: { value, onChange },
	} = useController({ name: FIELD_NAME });

	return (
		<label>
			<div className="mb-2 text-sm font-medium leading-none text-brand-800">
				¿Cuáles preguntas?
			</div>

			<RadioGroup
				value={value}
				onChange={onChange}
				className="grid grid-cols-3 rounded-lg bg-gray-100 p-1.5"
			>
				{QUESTION_TYPE_OPTIONS.map((option) => (
					<RadioGroup.Option
						key={`radio-card-${option.value}`}
						value={option.value}
						className={({ checked }) =>
							cn(
								'flex items-center justify-center rounded-lg px-4 py-2 text-center text-sm font-medium focus:outline-none',
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

			<FieldError name={FIELD_NAME} />
		</label>
	);
}
