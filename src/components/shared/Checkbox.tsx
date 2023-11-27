import { ComponentPropsWithRef, forwardRef } from 'react';
import { FieldError } from './Form';

interface CheckboxProps extends ComponentPropsWithRef<'input'> {
	label: string;
	description: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	function Checkbox({ label, description, ...props }, ref) {
		return (
			<label
				htmlFor={props.name}
				className="flex cursor-pointer items-center gap-x-6 rounded-lg border bg-white px-6 py-4 shadow-sm hover:bg-gray-100 focus:outline-none"
			>
				<div className="flex flex-1 flex-col text-sm">
					<div className="text-gray-90 font-medium">{label}</div>

					<div className="text-gray-500">{description}</div>
				</div>

				<input
					ref={ref}
					type="checkbox"
					id={props.name}
					name={props.name}
					{...props}
				/>

				<FieldError name={props.name} />
			</label>
		);
	},
);
