import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { Button } from '~/components/shared/Button';
import { Page } from '~/components/shared/Page';
import { api } from '~/utils/api';
import { formatDate } from '~/utils/transforms';

export function ViewNote() {
	const router = useRouter();

	const { data } = api.note.get.useQuery(
		{ id: router.query.noteId as string },
		{ enabled: !!router.isReady && !!router.query.noteId },
	);

	return (
		<Page>
			<div className="space-y-4">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-x-4">
						<Button variant="secondary" size="icon" href="/control-panel">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">Nota</h1>
					</div>
				</header>

				{data && (
					<div className="space-y-4 rounded-xl border-2 border-brand-300 bg-white px-4 py-6 shadow-sm">
						<div className="flex w-full items-center justify-between">
							<span className="text-xl font-medium">{data.name}</span>
							<span className="text-xs">{formatDate(data.date)}</span>
						</div>

						<div className="w-full">
							<pre className="rounded-lg bg-brand-100 p-4 text-sm">
								{data.adittionalNotes}
							</pre>
						</div>

						<div>
							<span className="text-sm font-medium">Link (PDF)</span>

							<Button
								href={data.fileSrc}
								target="_blank"
								rel="noopener"
								variant="ghost"
								className="max-w-full"
							>
								<span className="truncate">{data.fileSrc}</span>
							</Button>
						</div>

						<div>
							<span className="text-sm font-medium">Video clase</span>

							{data.videoSrc ? (
								<Button
									href={data.videoSrc}
									target="_blank"
									rel="noopener"
									variant="ghost"
									className="max-w-full"
								>
									<span className="truncate">{data.videoSrc}</span>
								</Button>
							) : (
								<div className="px-4 text-sm font-semibold">
									No hay link de video.
								</div>
							)}
						</div>

						<div>
							<span className="text-sm font-medium">Lección para práctica</span>

							{data.relatedLesson ? (
								<Button
									href={`/control-panel/units/${data.relatedLesson.unit.id}/${data.relatedLesson.id}`}
									variant="ghost"
									className="w-full space-x-3"
								>
									<span>{data.relatedLesson.unit.name}</span>
									<span>&rsaquo;</span>
									<span>{data.relatedLesson.name}</span>
								</Button>
							) : (
								<div className="px-4 text-sm font-semibold">
									No hay lección para práctica.
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</Page>
	);
}
