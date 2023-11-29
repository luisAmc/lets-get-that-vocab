import { Button } from '../shared/Button';
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CreateLessonForm } from './CreateLessonForm';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { RouterOutputs } from '~/utils/api';
import Link from 'next/link';

interface UnitProps {
	unit: RouterOutputs['unit']['getAll'][number];
}

export function Unit({ unit }: UnitProps) {
	return (
		<Page>
			<div className="border-brand-300 flex w-full flex-col gap-y-4 rounded-xl border-2 bg-white px-4 py-6 shadow-sm">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-x-2">
						<Button variant="secondary" size="icon" href="/">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">{unit.name}</h1>
					</div>

					<Button variant="destructive" size="icon">
						<TrashIcon className="h-5 w-5" />
					</Button>
				</header>

				{/* <h1 className="mb-4 text-2xl">{unit.name}</h1> */}

				<span className="text-sm font-medium">Lecciones</span>

				<div className="flex flex-col">
					{unit.lessons.length > 0 ? (
						unit.lessons.map((lesson, lessonIndex) => (
							<Link
								href={`/control-panel/${unit.id}/${lesson.id}`}
								key={lesson.id}
								className="hover:bg-brand-200 rounded-lg px-4 py-3"
							>
								{lesson.name}
							</Link>
						))
					) : (
						<span className="py-10 text-center text-sm font-medium">
							Esta lección todavía no tiene lecciones.
						</span>
					)}
				</div>

				<CreateLessonForm unitId={unit.id} />
			</div>

			<PrivacyScreen />
		</Page>
	);
}
