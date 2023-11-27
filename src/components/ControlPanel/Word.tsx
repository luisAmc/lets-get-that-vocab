import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { Page } from '../shared/Page';
import { Button } from '../shared/Button';
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export function Word() {
	const router = useRouter();

	const { data } = api.word.get.useQuery(
		{ id: router.query.wordId as string },
		{ enabled: !!router.isReady },
	);

	return (
		<Page>
			{data ? (
				<article className="flex w-full flex-col gap-y-2 rounded-xl bg-white px-4 py-6 text-gray-700">
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

					<section className="mt-2 space-y-4">
						<span className="rounded-full bg-gray-500 px-2 py-1 text-xs text-gray-50">
							{data.tag.name}
						</span>

						<Image
							alt="word image"
							src={data.imgSrc}
							width={500}
							height={500}
							className="h-64 w-full rounded-lg object-cover"
						/>
					</section>
				</article>
			) : (
				<span>No hay una palabra con este ID.</span>
			)}
		</Page>
	);
}
