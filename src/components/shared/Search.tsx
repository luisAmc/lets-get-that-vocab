import { ComponentPropsWithRef, forwardRef, useMemo, useState } from 'react';
import { FieldError } from './Form';

export type SearchOption = { label: string; value: string };

interface SearchProps extends ComponentPropsWithRef<'select'> {
	label?: string;
	placeholder?: string;
	options: Array<SearchOption>;
}

export const Search = forwardRef<HTMLSelectElement, SearchProps>(
	function Search({ label, options, ...props }, ref) {
		const [query, setQuery] = useState('');

		const filteredOptions = useMemo(() => {
			if (!query) {
				return options;
			}

			return (
				options.filter((option) =>
					option.label
						.toLowerCase()
						.replace(/\s+/g, '')
						.includes(query.toLowerCase().replace(/\s+/g, '')),
				) ?? []
			);
		}, [query, options]);

		return (
			<label>
				{label && (
					<div className="mb-2 text-sm font-medium leading-none text-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
						{label}
					</div>
				)}

				<select
					{...props}
					ref={ref}
					className="h-10 w-full rounded-lg border border-solid border-brand-200 px-3 py-2 text-sm text-brand-800 transition ease-in-out focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
				>
					<option value="">{props.placeholder || label}</option>
					{filteredOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<FieldError name={props.name} />
			</label>
		);
	},
);
