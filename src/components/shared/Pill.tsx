interface PillProps {
	children: string;
}

export function Pill({ children }: PillProps) {
	return (
		<span className="rounded-full bg-brand-600 px-2 py-1 text-xs font-bold text-brand-50">
			{children}
		</span>
	);
}
