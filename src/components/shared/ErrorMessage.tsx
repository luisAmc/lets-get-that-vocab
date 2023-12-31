interface ErrorMessageProps {
	title: string;
	error?: string;
}

export function ErrorMessage({ title, error }: ErrorMessageProps) {
	if (!error) return null;

	return (
		<div className="space-y-1 rounded-md border-2 border-red-500 border-opacity-50 bg-red-50 p-4 dark:bg-red-900 dark:bg-opacity-10">
			{title && (
				<h3 className="text-sm font-medium text-red-800 dark:text-red-200">
					{title}
				</h3>
			)}
			<div className="text-sm text-red-700 dark:text-red-200">{error}</div>
		</div>
	);
}
