import { RadioGroup } from '@headlessui/react';
import { useController } from 'react-hook-form';
import { FieldError } from '~/components/shared/Form';
import { cn } from '~/utils/cn';

export const NUMBER_TYPES = {
	'고유어 수': '고유어 수',
	'한자어 수': '한자어 수',
};

const NUMBER_TYPE_OPTIONS = [
	{ label: '한자어 수', value: NUMBER_TYPES['한자어 수'] },
	{ label: '고유어 수', value: NUMBER_TYPES['고유어 수'] },
] as const;

const FIELD_NAME = 'numberType';

export function NumberTypeGroup() {
	const {
		field: { value, onChange },
	} = useController({ name: FIELD_NAME });

	return (
		<label>
			<div className="mb-2 text-sm font-medium leading-none text-brand-800">
				¿Qué tipo?
			</div>

			<RadioGroup
				value={value}
				onChange={onChange}
				className="grid grid-cols-2 rounded-lg bg-gray-100 p-1.5"
			>
				{NUMBER_TYPE_OPTIONS.map((option) => (
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
