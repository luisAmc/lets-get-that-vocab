import { api } from '~/utils/api';
import { Button } from '../shared/Button';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { CreateNoteModal } from './Note/CreateNoteModal';
import { CreateUnitModal } from './Unit/CreateUnitModal';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { Unit } from './Unit';
import { Note } from './Note';

export function WordCreation() {
	const unitsQuery = api.unit.getAll.useQuery();
	const notesQuery = api.note.getAll.useQuery();

	const units = unitsQuery.data ?? [];
	const notes = notesQuery.data ?? [];

	return (
		<Page>
			<div className="flex flex-col gap-y-4">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-x-4">
						<Button variant="secondary" size="icon" href="/">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">Panel de control</h1>
					</div>
				</header>

				{!unitsQuery.isLoading && units && (
					<article className="border- rounded-xl border border-brand-100 bg-brand-50 p-4 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-x-2">
								<h1 className="text-2xl">Unidades</h1>
							</div>

							<Button variant="secondary" href="/control-panel/tags">
								Etiquetas
							</Button>
						</div>

						<section className="flex flex-col gap-y-4">
							<CreateUnitModal />

							{units.length > 0 ? (
								units.map((unit) => <Unit key={unit.id} unit={unit} />)
							) : (
								<div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-brand-600">
									No se han creado unidades todavía.
								</div>
							)}
						</section>
					</article>
				)}

				{!notesQuery.isLoading && units && (
					<article className="border- rounded-xl border border-brand-100 bg-brand-50 p-4 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<h1 className="text-2xl">Notas</h1>
						</div>

						<section className="flex flex-col gap-y-4">
							<CreateNoteModal />

							{notes.length > 0 ? (
								notes.map((note) => <Note key={note.id} note={note} />)
							) : (
								<div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-brand-600">
									No se han creado notas todavía.
								</div>
							)}
						</section>
					</article>
				)}
			</div>
			<PrivacyScreen />
		</Page>
	);
}
