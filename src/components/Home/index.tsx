import { cn } from '~/utils/cn';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { ReactNode } from 'react';
import Link from 'next/link';

export function Home() {
	return (
		<Page>
			<div className="flex h-full flex-col justify-evenly gap-y-2">
				<Card href="/notes">
					<img
						alt="notes image"
						src="/images/notes.webp"
						className="flex aspect-square h-[90%] items-center justify-center"
					/>

					<span className="text-3xl font-bold text-brand-600">Notas</span>
				</Card>

				<Card href="/practice">
					<img
						alt="practice image"
						src="/images/practice.webp"
						className="flex aspect-square h-[90%] items-center justify-center"
					/>

					<span className="text-3xl font-bold text-brand-600">Práctica</span>
				</Card>
			</div>

			<PrivacyScreen />
		</Page>
	);
}

interface CardProps {
	href: string;
	children: ReactNode;
}

function Card({ href, children }: CardProps) {
	return (
		<Link
			href={href}
			className={cn(
				'flex flex-col items-center justify-center gap-y-2',
				'aspect-square h-1/2 rounded-xl bg-brand-50 p-8',
				'border-2 border-solid border-brand-100',
				'hover:cursor-pointer hover:border-brand-300 hover:bg-brand-100',
				'transition-colors ease-out',
			)}
		>
			{children}
		</Link>
	);
}
