import { api } from '~/utils/api';
import { cn } from '~/utils/cn';
import { Header } from '../shared/Header';
import { LessonOptionsModal, LessonType } from './LessonOptionsModal';
import { Loading } from '../shared/Loading';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { useModal } from '../shared/Modal';
import { useState } from 'react';
import Link from 'next/link';

const shiftValues = [
	'm-0',
	// '-ml-[45px]',
	'-ml-[100px]',
	// '-ml-[45px]',
	'm-0',
	// 'ml-[45px]',
	'ml-[100px]',
	// 'ml-[45px]',
];

const shiftValuesReversed = [
	'm-0',
	// 'ml-[45px]',
	'ml-[100px]',
	// 'ml-[45px]',
	'm-0',
	// '-ml-[45px]',
	'-ml-[100px]',
	// '-ml-[45px]',
];

export function Home() {
	const { data, isLoading } = api.unit.getAll.useQuery();

	const lessonOptionsModal = useModal();

	const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);

	function handleLessonClick(clickedLesson: LessonType) {
		setSelectedLesson(clickedLesson);
		lessonOptionsModal.open();
	}

	return (
		<Page>
			{isLoading && <Loading />}

			{!isLoading && data && (
				<>
					<Header />

					<Link href="/control-panel">Link</Link>

					{data.map((unit, unitIndex) => (
						<section
							key={unit.id}
							className="flex w-full flex-col rounded-xl bg-white/10"
						>
							<div className="flex items-center rounded-t-xl bg-gray-200/50 p-6">
								<span className="text-3xl font-medium text-gray-600">
									{unit.name}
								</span>
							</div>

							<div className="flex flex-col items-center justify-center gap-y-4 py-4 text-gray-900">
								{unit.lessons
									// .filter((lesson) => lesson._count.words > 0)
									.map((lesson, lessonIndex) => (
										<div
											key={lesson.id}
											className={
												unitIndex % 2 === 0
													? shiftValues[lessonIndex % shiftValues.length]
													: shiftValuesReversed[
															lessonIndex % shiftValues.length
													  ]
											}
										>
											<button
												onClick={() => handleLessonClick(lesson)}
												className={cn(
													'relative flex h-32 w-32 items-center justify-center rounded-full border-b-8 border-sky-700 bg-sky-400 p-4 shadow-md',
													'hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-primary focus:ring-offset-4',
													'transition-transform hover:-translate-y-0.5',
												)}
											>
												<span className="text-lg font-semibold text-sky-800">
													{lesson.name}
												</span>
											</button>
										</div>
									))}
							</div>
						</section>
					))}
				</>
			)}

			{selectedLesson && (
				<LessonOptionsModal
					{...lessonOptionsModal.props}
					lesson={selectedLesson}
				/>
			)}

			<PrivacyScreen />
		</Page>
	);
}
