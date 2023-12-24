import { useRouter } from 'next/router';
import { Page } from '~/components/shared/Page';
import { api } from '~/utils/api';
import { CreateTagModal } from './CreateTagModal';

export function Tags() {
	const router = useRouter();

	const { data } = api.tag.getAll.useQuery(undefined, {
		enabled: !!router.isReady,
	});

	const tags = data ?? [];

	return (
		<Page to='/control-panel/units' title="Etiquetas" action={<CreateTagModal />}>
			{data && (
				<section className="flex w-full flex-col divide-y rounded-xl border-2 border-brand-300 bg-white px-4 py-6 shadow-sm">
					{tags.length > 0 ? (
						tags.map((tag) => (
							<div key={tag.id} className="py-2 text-sm">
								{tag.name}
							</div>
						))
					) : (
						<div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-brand-600">
							No se han creado etiquetas todavía.
						</div>
					)}
				</section>
			)}
		</Page>
	);
}
