import { useRouter } from 'next/router';
import { Page } from '../shared/Page';
import { api } from '~/utils/api';
import { Button } from '../shared/Button';
import { ChevronLeftIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { Loading } from '../shared/Loading';

export function Lesson() {
	const router = useRouter();
	const lessonId = router.query.lessonId as string;

	const { data, isLoading } = api.lesson.get.useQuery(
		{ id: lessonId },
		{ enabled: !!lessonId, refetchOnWindowFocus: false },
	);

	return (
		<Page>
			{isLoading && <Loading />}

			{data && (
				<article className="flex w-full flex-col gap-y-4 rounded-xl border border-brand-200 bg-white p-4">
					<header className="flex items-center gap-x-2">
						<Button variant="secondary" size="icon" href="/">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">{data.name}</h1>
					</header>

					<section>
						<div className="mb-2 flex items-center justify-between">
							<span className="text-sm font-semibold">Palabras o frases</span>

							<span className="text-sm font-semibold">
								<span className="mr-1">{data.words.length}</span>
								<span>en total</span>
							</span>
						</div>

						<div className="divide-y">
							{data.words.map((word) => (
								<div>
									<Disclosure>
										{({ open }) => (
											<>
												<Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 font-medium hover:bg-brand-200 focus:outline-none focus-visible:ring focus-visible:ring-brand-500/75">
													<span>{word.text}</span>

													<ChevronUpIcon
														className={`${
															open ? 'rotate-180 transform' : ''
														} h-5 w-5 text-brand-500`}
													/>
												</Disclosure.Button>

												<Disclosure.Panel className="mt-1 px-4 pb-2">
													<div className="relative h-64 overflow-hidden rounded-lg">
														<div className="absolute inset-0 animate-pulse bg-brand-200"></div>

														<img
															src={word.imgSrc}
															className="relative h-full w-full object-cover"
														/>
													</div>
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								</div>
							))}
						</div>
					</section>
				</article>
			)}

			<PrivacyScreen />
		</Page>
	);
}
