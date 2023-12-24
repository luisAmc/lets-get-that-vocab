import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentProps } from 'react';
import {
	FieldValues,
	FormProvider,
	SubmitHandler,
	useForm,
	useFormContext,
	UseFormProps,
	UseFormReturn,
} from 'react-hook-form';
import { TypeOf, ZodSchema } from 'zod';

interface UseZodFormProps<T extends ZodSchema<any>>
	extends UseFormProps<TypeOf<T>> {
	schema: T;
}

export const useZodForm = <T extends ZodSchema<any>>({
	schema,
	...formConfig
}: UseZodFormProps<T>) => {
	return useForm({ ...formConfig, resolver: zodResolver(schema) });
};

interface FieldErrorsProps {
	name?: string;
}

export function FieldError({ name }: FieldErrorsProps) {
	const {
		formState: { errors },
	} = useFormContext();

	if (!name) return null;

	const error = errors[name];

	if (!error) return null;

	return (
		<div className="text-sm font-semibold text-red-500">
			{error.message as string}
		</div>
	);
}

export interface FormProps<T extends FieldValues = any>
	extends Omit<ComponentProps<'form'>, 'onSubmit'> {
	form: UseFormReturn<T>;
	onSubmit: SubmitHandler<T>;
	submitted?: boolean;
}

export const Form = <T extends FieldValues>({
	form,
	onSubmit,
	children,
	submitted = false,
	...props
}: FormProps<T>) => {
	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				{...props}
				className="flex-1"
			>
				<fieldset
					className="flex h-full flex-col gap-y-4"
					disabled={form.formState.isSubmitting || submitted}
				>
					{children}
				</fieldset>
			</form>
		</FormProvider>
	);
};
