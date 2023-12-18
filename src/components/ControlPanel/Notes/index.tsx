import { api } from '~/utils/api';
import { CreateNoteModal } from './CreateNoteModal';
import { Page } from '~/components/shared/Page';
import { Button } from '~/components/shared/Button';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { formatDate } from '~/utils/transforms';

export function Notes() {
	const { data, isLoading } = api.note.getAll.useQuery();

	const notes = data ?? [];

	return (
		<Page>
			<div className="space-y-4">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-x-4">
						<Button variant="secondary" size="icon" href="/control-panel">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">Notas</h1>
					</div>
				</header>

				{!isLoading && notes && (
					<article className="border- rounded-xl border border-brand-100 bg-brand-50 p-4 shadow-sm">
						<section className="flex flex-col gap-y-4">
							<CreateNoteModal />

							{notes.length > 0 ? (
								notes.map((note) => (
									<Button
										key={note.id}
										href={`/control-panel/notes/${note.id}`}
										variant="outline"
										className="flex items-center justify-between bg-white"
									>
										<span>{note.name}</span>
										<span className="text-sm">{formatDate(note.date)}</span>
									</Button>
								))
							) : (
								<div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-brand-600">
									No se han creado notas todavía.
								</div>
							)}
						</section>
					</article>
				)}
			</div>
		</Page>
	);
}
