import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { Page } from '../shared/Page';
import { Button } from '../shared/Button';
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PrivacyScreen } from '../shared/PrivacyScreen';

export function Word() {
	const router = useRouter();

	const { data } = api.word.get.useQuery(
		{ id: router.query.wordId as string },
		{ enabled: !!router.isReady },
	);

	return (
		<Page>
			{data && (
				<article className="border-brand-300 flex w-full flex-col gap-y-4 rounded-xl border-2 bg-white px-4 py-6 shadow-sm">
					<header className="flex items-center justify-between">
						<div className="flex items-center gap-x-2">
							<Button
								variant="secondary"
								size="icon"
								href={`${router.asPath.substring(
									0,
									router.asPath.lastIndexOf('/'),
								)}`}
							>
								<ChevronLeftIcon className="h-5 w-5" />
							</Button>

							<h1 className="text-2xl">{data.text}</h1>
						</div>

						<Button variant="destructive" size="icon">
							<TrashIcon className="h-5 w-5" />
						</Button>
					</header>

					<div className="bg-brand-100 h-64 overflow-hidden rounded-lg">
						<img
							alt="word image"
							src={data.imgSrc}
							className="h-full w-full object-cover"
						/>
					</div>

					<div>
						<span className="mt-2 rounded-full bg-gray-500 px-2 py-1 text-xs text-gray-50">
							{data.tag.name}
						</span>
					</div>
				</article>
			)}

			<PrivacyScreen />
		</Page>
	);
}
