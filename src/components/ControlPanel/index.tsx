import { api } from '~/utils/api';
import { Page } from '../shared/Page';
import { CreateUnitForm } from './CreateUnitForm';
import { Unit } from './Unit';
import { Loading } from '../shared/Loading';
import { PrivacyScreen } from '../shared/PrivacyScreen';

export function WordCreation() {
	const { data, isLoading } = api.unit.getAll.useQuery();

	const units = data ?? [];

	return (
		<Page>
			{isLoading && <Loading />}

			{!isLoading && units && (
				<section className="flex h-full w-full flex-col gap-y-4">
					{units.length > 0 ? (
						units.map((unit) => <Unit key={unit.id} unit={unit} />)
					) : (
						<div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-gray-600">
							No se han creado unidades todavía.
						</div>
					)}

					<CreateUnitForm />
				</section>
			)}

			<PrivacyScreen />
		</Page>
	);
}
