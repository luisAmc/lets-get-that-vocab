import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '../shared/Button';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { CreateNoteModal } from './CreateNoteModal';
import { RouterOutputs, api } from '~/utils/api';
import { formatDate } from '~/utils/transforms';

export function Notes() {
	const { data, isLoading } = api.note.getAll.useQuery();

	const notes = data ?? [];

	return (
		<Page>
			<article className="flex flex-col gap-y-4">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-x-4">
						<Button variant="secondary" size="icon" href="/">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">Notas</h1>
					</div>

					<CreateNoteModal />
				</header>

				{isLoading && <Skeleton />}

				{!isLoading &&
					(notes.length > 0 ? <NoteList notes={notes} /> : <EmptyNoteList />)}
			</article>

			<PrivacyScreen />
		</Page>
	);
}

interface NoteListProps {
	notes: RouterOutputs['note']['getAll'];
}

function NoteList({ notes }: NoteListProps) {
	return (
		<section className="flex flex-col gap-y-2">
			{notes.map((note) => (
				<a
					href={note.fileSrc}
					target="_blank"
					key={note.id}
					className="group rounded-xl bg-brand-100 px-4 py-3 transition-colors ease-out hover:cursor-pointer hover:bg-brand-200 hover:shadow-sm"
				>
					<div className="flex w-full items-center justify-between">
						<span className="text-xl font-medium">{note.name}</span>

						<span className="text-xs">{formatDate(note.date)}</span>
					</div>

					<div className="mt-2">
						<pre className="mt-1 rounded-lg bg-brand-200 p-4 text-sm text-brand-700 transition-colors ease-out group-hover:bg-brand-300">
							{note.adittionalNotes}
						</pre>
					</div>
				</a>
			))}
		</section>
	);
}

function EmptyNoteList() {
	return <section>EmptyNoteList</section>;
}

function Skeleton() {
	return (
		<div className="animate-pulse space-y-2">
			<div className="space-y-2  rounded-xl bg-brand-100 p-4">
				<div className="flex items-center justify-between">
					<div className="h-8 w-40 rounded-lg bg-brand-200"></div>
					<div className="h-4 w-32 rounded-lg bg-brand-200"></div>
				</div>

				<div className="h-32 rounded-lg bg-brand-200"></div>
			</div>

			<div className="space-y-2  rounded-xl bg-brand-100 p-4">
				<div className="flex items-center justify-between">
					<div className="h-8 w-40 rounded-lg bg-brand-200"></div>
					<div className="h-4 w-32 rounded-lg bg-brand-200"></div>
				</div>

				<div className="h-32 rounded-lg bg-brand-200"></div>
			</div>

			<div className="space-y-2  rounded-xl bg-brand-100 p-4">
				<div className="flex items-center justify-between">
					<div className="h-8 w-40 rounded-lg bg-brand-200"></div>
					<div className="h-4 w-32 rounded-lg bg-brand-200"></div>
				</div>

				<div className="h-32 rounded-lg bg-brand-200"></div>
			</div>
		</div>
	);
}
