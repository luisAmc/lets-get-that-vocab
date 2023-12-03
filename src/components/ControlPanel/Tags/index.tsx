import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { Button } from '~/components/shared/Button';
import { Page } from '~/components/shared/Page';
import { api } from '~/utils/api';
import { CreateTagModal } from './CreateTagModal';
import { PrivacyScreen } from '~/components/shared/PrivacyScreen';

export function Tags() {
	const router = useRouter();

	const { data } = api.tag.getAll.useQuery(undefined, {
		enabled: !!router.isReady,
	});

	const tags = data ?? [];

	return (
		<Page>
			{data && (
				<article>
					<header className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-x-2">
							<Button variant="secondary" size="icon" href="/control-panel">
								<ChevronLeftIcon className="h-5 w-5" />
							</Button>

							<h1 className="text-2xl">Etiquetas</h1>
						</div>

						<CreateTagModal />
					</header>

					<section className="flex w-full flex-col divide-y rounded-xl border-2 border-brand-300 bg-white px-4 py-6 shadow-sm">
						{tags.length > 0 ? (
							tags.map((tag) => <div className="py-2 text-sm">{tag.name}</div>)
						) : (
							<div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-brand-600">
								No se han creado etiquetas todavía.
							</div>
						)}
					</section>
				</article>
			)}

			<PrivacyScreen />
		</Page>
	);
}
