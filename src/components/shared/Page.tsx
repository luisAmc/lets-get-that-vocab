import { Button } from './Button';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { PrivacyScreen } from './PrivacyScreen';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { cn } from '~/utils/cn';

interface PageProps {
	goBack?: boolean;
	to?: string;
	title?: string;
	action?: ReactNode;
	className?: string;
	children: ReactNode;
}

export function Page({
	goBack = false,
	to,
	title,
	action,
	className,
	children,
}: PageProps) {
	const router = useRouter();

	const backRoute =
		router.asPath.substring(0, router.asPath.lastIndexOf('/')) || '/';

	const hasHeader = goBack || to || title || action;

	return (
		<main
			className={cn(
				'relative mx-auto h-full w-full max-w-lg px-2 py-4',
				className,
			)}
		>
			{hasHeader && (
				<header className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-x-4">
						{(goBack || to) && (
							<Button
								variant="secondary"
								size="icon"
								href={goBack ? backRoute : to}
							>
								<ChevronLeftIcon className="h-5 w-5" />
							</Button>
						)}

						{title && <h1 className="text-2xl">{title}</h1>}
					</div>

					{action}
				</header>
			)}

			{children}

			<PrivacyScreen />
		</main>
	);
}
