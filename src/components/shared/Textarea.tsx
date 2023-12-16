import { ComponentPropsWithRef, forwardRef } from 'react';
import { FieldError } from './Form';
import { cn } from '~/utils/cn';

interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
	label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea({ label, ...props }, ref) {
		return (
			<label>
				{label && (
					<div className="mb-2 text-sm font-medium leading-none text-brand-800">
						{label}
					</div>
				)}

				<textarea
					ref={ref}
					className={cn(
						'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm',
						'border-input placeholder:text-muted-foreground ring-offset-white ',
						'focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2',
						'disabled:cursor-not-allowed disabled:opacity-50',
						'appearance-none transition ease-in-out',
					)}
					placeholder={`${props.placeholder || label}...`}
					{...props}
				/>

				<FieldError name={props.name} />
			</label>
		);
	},
);
