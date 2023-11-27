import { RouterOutputs } from '~/utils/api';
import { CreateLessonForm } from './CreateLessonForm';
import Link from 'next/link';

interface UnitProps {
	unit: RouterOutputs['unit']['getAll'][number];
}

export function Unit({ unit }: UnitProps) {
	return (
		<div className="flex flex-col gap-y-2 rounded-xl bg-white px-4 py-6 text-gray-700">
			<h1 className="text-2xl">{unit.name}</h1>

			<span className="text-xs font-medium uppercase tracking-widest">
				Lecciones
			</span>

			{unit.lessons.length > 0 ? (
				unit.lessons.map((lesson) => (
					<Link
						href={`/control-panel/${unit.id}/${lesson.id}`}
						key={lesson.id}
						className="rounded-xl bg-gray-50 px-3 py-2 hover:cursor-pointer hover:bg-gray-200"
					>
						{lesson.name}
					</Link>
				))
			) : (
				<span>Esta lección todavía no tiene lecciones.</span>
			)}

			<CreateLessonForm unitId={unit.id} />
		</div>
	);
}
