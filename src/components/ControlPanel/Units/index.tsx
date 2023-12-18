import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { CreateUnitModal } from './Unit/CreateUnitModal';
import { Page } from '~/components/shared/Page';
import { Unit } from './Unit';
import { ChevronLeftIcon, TagIcon } from '@heroicons/react/24/outline';

export function Units() {
	const { data, isLoading } = api.unit.getAll.useQuery();

	const units = data ?? [];

	return (
		<Page>
			<div className="space-y-4">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-x-4">
						<Button variant="secondary" size="icon" href="/control-panel">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">Unidades</h1>
					</div>

					<Button variant="secondary" href="/control-panel/tags">
						<TagIcon className="mr-1 h-4 w-4" />
						<span>Etiquetas</span>
					</Button>
				</header>

				{!isLoading && units && (
					<article className="border- rounded-xl border border-brand-100 bg-brand-50 p-4 shadow-sm">
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
			</div>
		</Page>
	);
}
