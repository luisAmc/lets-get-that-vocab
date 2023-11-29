import { CreateLessonForm } from './CreateLessonForm';
import { RouterOutputs } from '~/utils/api';
import Link from 'next/link';

interface UnitProps {
	unit: RouterOutputs['unit']['getAll'][number];
}

export function Unit({ unit }: UnitProps) {
	return (
		<div className="flex w-full flex-col gap-y-4 rounded-xl border-2 border-brand-300 bg-white px-4 py-6 shadow-sm">
			<h1 className="text-2xl">{unit.name}</h1>

			<span className="text-sm font-medium">Lecciones</span>

			<div className="flex flex-col">
				{unit.lessons.length > 0 ? (
					unit.lessons.map((lesson, lessonIndex) => (
						<Link
							href={`/control-panel/${unit.id}/${lesson.id}`}
							key={lesson.id}
							className="rounded-lg px-4 py-3 hover:bg-brand-200"
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
	);
}
