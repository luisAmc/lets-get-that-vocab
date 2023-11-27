import { RadioGroup } from '@headlessui/react';
import { useController } from 'react-hook-form';
import { cn } from '~/utils/cn';

interface OptionProps {
	label: string;
	value: string;
}

interface RadioButtonGroupProps {
	name: string;
	label: string;
	options: Array<OptionProps>;
}

export function RadioButtonGroup({
	name,
	label,
	options,
}: RadioButtonGroupProps) {
	const { field : {value, onChange} } = useController({ name });

	return (
		<label>
			<div className="mb-1 font-medium text-stone-800">{label}</div>

			<RadioGroup value={value} onChange={onChange}>
				<div className="">
					{options.map((option, optionIndex) => (
						<RadioGroup.Option
							key={`radio-option-${option.value}`}
							value={option.value}
							className={({ checked }) =>
								cn(
									optionIndex === 0 && 'rounded-t-md',
									optionIndex === options.length - 1 && 'rounded-b-md border-b',
									checked ? 'border-sky-200 bg-sky-50' : 'border-gray-200',
									'cursor-pointer border-x border-t p-4 focus:outline-none ',
								)
							}
						>
							{({ active, checked }) => (
								<>
									<span className="flex items-center text-sm">
										<span
											className={cn(
												checked
													? 'border-transparent bg-sky-600'
													: 'border-sky-300 bg-white',
												active && 'ring-offset-600 ring-2 ring-offset-2',
												'grid h-4 w-4 place-items-center rounded-full border',
											)}
										>
											<span className="h-1.5 w-1.5 rounded-full bg-white"></span>
										</span>

										<RadioGroup.Label
											className={cn(
												checked ? 'text-sky-900' : 'text-gray-900',
												'ml-3 font-medium',
											)}
										>
											{option.label}
										</RadioGroup.Label>
									</span>
								</>
							)}
						</RadioGroup.Option>
					))}
				</div>
			</RadioGroup>
		</label>
	);
}
