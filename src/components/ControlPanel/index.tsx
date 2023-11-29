import { api } from '~/utils/api';
import { Page } from '../shared/Page';
import { CreateUnitForm } from './CreateUnitForm';
import { Unit } from './Unit';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { Button } from '../shared/Button';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export function WordCreation() {
	const { data, isLoading } = api.unit.getAll.useQuery();

	const units = data ?? [];

	return (
		<Page>
			{!isLoading && units && (
				<article>
					<header className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-x-2">
							<Button variant="secondary" size="icon" href="/">
								<ChevronLeftIcon className="h-5 w-5" />
							</Button>

							<h1 className="text-2xl">Unidades</h1>
						</div>
					</header>

					<section className="flex flex-col gap-y-4">
						{units.length > 0 ? (
							units.map((unit) => <Unit key={unit.id} unit={unit} />)
						) : (
							<div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-brand-600">
								No se han creado unidades todavía.
							</div>
						)}

						<CreateUnitForm />
					</section>
				</article>
			)}

			<PrivacyScreen />
		</Page>
	);
}
