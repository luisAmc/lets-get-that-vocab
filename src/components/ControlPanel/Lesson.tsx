import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { Page } from '../shared/Page';
import { Button } from '../shared/Button';
import {
	ChevronLeftIcon,
	FaceFrownIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import { CreateWordForm } from './CreateWordForm';
import Link from 'next/link';
import { PrivacyScreen } from '../shared/PrivacyScreen';

export function Lesson() {
	const router = useRouter();

	const { data } = api.lesson.get.useQuery(
		{ id: router.query.lessonId as string },
		{ enabled: !!router.isReady },
	);

	const words = data?.words ?? [];

	return (
		<Page>
			{data ? (
				<article className="flex w-full flex-col gap-y-2 rounded-xl bg-white px-4 py-6 text-gray-700">
					<header className="flex items-center justify-between">
						<div className="flex items-center gap-x-2">
							<Button variant="secondary" size="icon" href="/control-panel">
								<ChevronLeftIcon className="h-5 w-5" />
							</Button>

							<h1 className="text-2xl">{data.name}</h1>
						</div>

						<Button variant="destructive" size="icon">
							<TrashIcon className="h-5 w-5" />
						</Button>
					</header>

					<section>
						<span className="text-xs font-medium uppercase tracking-widest">
							Palabras ({words.length})
						</span>

						<div className="flex flex-col gap-y-2">
							{words.length > 0 ? (
								words.map((word) => (
									<Link
										href={`${router.asPath}/${word.id}`}
										key={word.id}
										className="rounded-xl bg-gray-50 px-3 py-2 hover:cursor-pointer hover:bg-gray-200"
									>
										{word.text}
									</Link>
								))
							) : (
								<div className="my-2 grid place-items-center gap-y-2 rounded-lg border-2 border-dashed border-gray-400 p-12 text-sm font-medium text-gray-500">
									<FaceFrownIcon className="h-16 w-16 stroke-1" />
									<span>Esta lección todavía no tiene palabras</span>
								</div>
							)}

							<CreateWordForm />
						</div>
					</section>
				</article>
			) : (
				<span>No hay una lección con este ID.</span>
			)}

			<PrivacyScreen />
		</Page>
	);
}
