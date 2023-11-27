import { ButtonOrLink, ButtonOrLinkProps } from './ButtonOrLink';
import { VariantProps, cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-gray-600 text-gray-50 hover:bg-gray-600/90',
				destructive: 'bg-red-500 text-red-50 hover:bg-red-500/90',
				secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-300/80',
				ghost: 'hover:bg-gray-300 hover:text-gray-700'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-lg px-3',
				lg: 'h-11 rounded-lg px-8',
				icon: 'h-8 w-8 rounded-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends VariantProps<typeof buttonVariants>,
		ButtonOrLinkProps {
	loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button({ className, variant, size, ...props }, ref) {
		return (
			<ButtonOrLink
				ref={ref}
				className={cn(buttonVariants({ variant, size, className }))}
				{...props}
			/>
		);
	},
);
