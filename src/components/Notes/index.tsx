import { api } from '~/utils/api';
import { BookOpenIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '../shared/Button';
import { NoteList } from './NoteList';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';

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
				</header>

				{isLoading && <Skeleton />}

				{!isLoading &&
					(notes.length > 0 ? <NoteList notes={notes} /> : <EmptyNoteList />)}
			</article>

			<PrivacyScreen />
		</Page>
	);
}

function EmptyNoteList() {
	return (
		<section className="flex flex-col items-center justify-center gap-y-2 rounded-xl border border-brand-300 bg-brand-50 p-8 text-brand-600">
			<BookOpenIcon className="h-14 w-14 stroke-1" />
			<span className="text-sm font-medium">
				No se han creado notas hasta el momento.
			</span>
		</section>
	);
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
