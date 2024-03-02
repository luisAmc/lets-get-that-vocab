import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import {
	ChevronLeftIcon,
	FaceFrownIcon,
	PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { EditLessonModal } from './EditLessonModal';
import { Page } from '~/components/shared/Page';
import { useRouter } from 'next/router';
import Link from 'next/link';

export function Lesson() {
	const router = useRouter();

	const { data } = api.lesson.get.useQuery(
		{ id: router.query.lessonId as string },
		{ enabled: !!router.isReady && !!router.query.lessonId },
	);

	const words = data?.words ?? [];

	return (
		<Page>
			{data && (
				<article className="flex w-full flex-col gap-y-4 rounded-xl border-2 border-brand-300 bg-white px-4 py-6 shadow-sm">
					<header className="flex items-center justify-between">
						<div className="flex items-center gap-x-2">
							<Button
								variant="secondary"
								size="icon"
								href="/control-panel/units"
							>
								<ChevronLeftIcon className="h-5 w-5" />
							</Button>

							<h1 className="text-2xl">{data.name}</h1>
						</div>

						<EditLessonModal lesson={data} />
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
										className="rounded-lg px-3 py-2 hover:cursor-pointer hover:bg-brand-200"
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

							<Button
								variant="secondary"
								href={`${router.asPath}/create-words`}
							>
								<PlusCircleIcon className="mr-1 h-4 w-4" />
								<span>Añadir palabras o frases</span>
							</Button>
						</div>
					</section>
				</article>
			)}
		</Page>
	);
}
