import { ReactNode } from 'react';

interface PageProps {
	children: ReactNode;
}

export function Page({ children }: PageProps) {
	return (
		<main className="relative mx-auto flex h-full w-full max-w-lg flex-col items-center justify-center gap-y-8 px-2 py-8">
			{children}
		</main>
	);
}
