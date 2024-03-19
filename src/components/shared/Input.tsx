import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { FieldError } from './Form';

export const inputVariants = cva([
	'px-3 py-2 text-[16px] h-10 w-full rounded-lg border border-solid border-brand-200 text-brand-800',
	'focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2',
	'disabled:opacity-60 disabled:pointer-events-none',
	'appearance-none transition ease-in-out',
	'file:border-0 file:bg-transparent file:text-sm file:font-medium',
]);

interface InputProps
	extends VariantProps<typeof inputVariants>,
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
				<div className="mb-2 text-sm font-medium leading-none text-brand-800">
					{label}
				</div>
			)}

			<input
				className={inputVariants()}
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
