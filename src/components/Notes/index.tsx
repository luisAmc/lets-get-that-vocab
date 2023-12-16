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
						<div className="mt-1 rounded-lg bg-brand-200 p-4 text-sm transition-colors ease-out group-hover:bg-brand-300">
							{note.adittionalNotes}
						</div>
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
		<div className="flex animate-pulse flex-col overflow-hidden rounded-xl bg-brand-100">
			<div className="h-20 rounded-xl bg-brand-200"></div>

			<div className="flex flex-col items-center space-y-4 p-4">
				<div className="h-16 w-36 rounded-full border-b-8 border-brand-300 bg-brand-200"></div>

				<div className="-ml-[100px] h-16 w-36 rounded-full border-b-8 border-brand-300 bg-brand-200"></div>

				<div className="h-16 w-36 rounded-full border-b-8 border-brand-300 bg-brand-200"></div>

				<div className="ml-[100px] h-16 w-36 rounded-full border-b-8 border-brand-300 bg-brand-200"></div>

				<div className="h-16 w-36 rounded-full border-b-8 border-brand-300 bg-brand-200"></div>
			</div>
		</div>
	);
}
