import { ReactNode } from 'react';
import { PrivacyScreen } from './PrivacyScreen';

interface PageProps {
	children: ReactNode;
}

export function Page({ children }: PageProps) {
	return (
		<main className="relative mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-y-8 px-2 py-4">
			{children}
		</main>
	);
}
