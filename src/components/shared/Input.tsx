import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { FieldError } from './Form';

const inputStyles = cva([
	'px-3 py-2 text-sm h-10 w-full rounded-lg border border-solid border-gray-200 text-gray-600',
	'focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-white focus:ring-offset-2',
	'disabled:opacity-60 disabled:pointer-events-none',
	'hover:bg-opacity-80 appearance-none transition ease-in-out',
]);

interface InputProps
	extends VariantProps<typeof inputStyles>,
		ComponentPropsWithRef<'input'> {
	label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ label, type = 'text', ...props },
	ref,
) {
	return (
		<label>
			{label && (
				<div className="mb-2 text-sm font-medium leading-none text-gray-800 disabled:cursor-not-allowed disabled:opacity-70">
					{label}
				</div>
			)}

			<input
				className={inputStyles()}
				ref={ref}
				type={type}
				step={type === 'number' ? 'any' : undefined}
				autoComplete={props.autoComplete || 'off'}
				placeholder={`${props.placeholder || label}...`}
				onWheel={(event) =>
					event.target instanceof HTMLElement && event.target.blur()
				}
				{...props}
			/>

			<FieldError name={props.name} />
		</label>
	);
});
