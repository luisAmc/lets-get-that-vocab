import { ReactNode } from 'react';
import { PrivacyScreen } from './PrivacyScreen';

interface PageProps {
	children: ReactNode;
}

export function Page({ children }: PageProps) {
	return (
		<main className="relative mx-auto h-full w-full max-w-lg gap-y-8 px-2 py-4">
			{children}
		</main>
	);
}
