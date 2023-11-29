import { api } from '~/utils/api';
import { cn } from '~/utils/cn';
import { Header } from '../shared/Header';
import { LessonOptionsModal, LessonType } from './LessonOptionsModal';
import { Loading } from '../shared/Loading';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { useModal } from '../shared/Modal';
import { useState } from 'react';
import { AnimatePresence, Variants, motion } from 'framer-motion';

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

const lessonVariants: Variants = {
	initial: {
		opacity: 0,
		y: 20,
		transition: { duration: 0.3 },
	},
	animate: (lessonIndex) => ({
		opacity: 1,
		y: 0,
		transition: { delay: lessonIndex * 0.15 },
	}),
};

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
					{/* <Header /> */}

					{data
						.filter((unit) => unit.lessons.length > 0)
						.map((unit, unitIndex) => (
							<section
								key={unit.id}
								className="flex w-full flex-col rounded-xl bg-white"
							>
								<div
									className={cn(
										['bg-green-400', 'bg-purple-400', 'bg-teal-400'][
											unitIndex % 3
										],
										'flex items-center rounded-xl p-6',
									)}
								>
									<span className="text-3xl font-medium text-white">
										{unit.name}
									</span>
								</div>

								<AnimatePresence>
									<div className="flex flex-col items-center justify-center gap-y-4 py-4">
										{unit.lessons
											.filter((lesson) => lesson._count.words > 0)
											.map((lesson, lessonIndex) => (
												<motion.div
													key={lesson.id}
													className={
														unitIndex % 2 === 0
															? shiftValues[lessonIndex % shiftValues.length]
															: shiftValuesReversed[
																	lessonIndex % shiftValues.length
															  ]
													}
													initial="initial"
													animate="animate"
													variants={lessonVariants}
													custom={lessonIndex}
												>
													<button
														onClick={() => handleLessonClick(lesson)}
														className={cn(
															'relative flex items-center justify-center rounded-full border-b-8 border-green-800 bg-green-500 px-6 py-4 shadow-md',
															'hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-offset-4',
															'transition-transform hover:-translate-y-0.5',
														)}
													>
														<span className="text-lg font-semibold text-white">
															{lesson.name}
														</span>
													</button>
												</motion.div>
											))}
									</div>
								</AnimatePresence>
							</section>
						))}

					<div className="flex-1"></div>
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
