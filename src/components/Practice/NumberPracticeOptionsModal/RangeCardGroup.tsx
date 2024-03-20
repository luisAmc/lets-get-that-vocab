import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '~/utils/cn';
import { FieldError } from '~/components/shared/Form';
import { RadioGroup } from '@headlessui/react';
import { useController } from 'react-hook-form';

export const RANGES = {
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

const FIELD_NAME = 'range';

export function RangeCardGroup() {
	const {
		field: { value, onChange },
	} = useController({ name: FIELD_NAME });

	return (
		<label>
			<div className="mb-2 text-sm font-medium leading-none text-brand-800">
				¿Qué rango?
			</div>

			<RadioGroup
				value={value}
				onChange={onChange}
				className="grid grid-cols-2 gap-1"
			>
				{RANGE_OPTIONS.map((option) => (
					<RadioGroup.Option
						key={`radio-card-${option.value}`}
						value={option.value}
						className={({ checked }) =>
							cn(
								checked
									? 'border-brand-600 bg-white ring-2 ring-brand-600'
									: 'border-gray-300 bg-gray-50',
								'relative flex h-16 cursor-pointer rounded-lg border p-4 focus:outline-none font-medium',
							)
						}
					>
						{({ checked }) => (
							<>
								<span className="flex flex-1 items-center justify-between gap-y-2">
									<RadioGroup.Label>{option.label}</RadioGroup.Label>

									<CheckCircleIcon
										className={cn(
											'size-8',
											checked ? 'text-brand-600' : 'text-gray-100',
										)}
										aria-hidden="true"
									/>
								</span>
							</>
						)}
					</RadioGroup.Option>
				))}
			</RadioGroup>

			<FieldError name={FIELD_NAME} />
		</label>
	);
}
