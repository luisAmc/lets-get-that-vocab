import { LessonOptionsModal, LessonType } from '../Practice/LessonOptionsModal';
import { NoteCard } from './Note';
import { RouterOutputs } from '~/utils/api';
import { useModal } from '../shared/Modal';
import { useState } from 'react';

interface NoteListProps {
	notes: RouterOutputs['note']['getAll'];
}

export function NoteList({ notes }: NoteListProps) {
	const lessonOptionsModal = useModal();

	const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);

	function handleLessonClick(clickedLesson: LessonType) {
		setSelectedLesson(clickedLesson);
		lessonOptionsModal.open();
	}

	return (
		<section className="flex flex-col gap-y-4">
			{notes.map((note) => (
				<NoteCard
					key={note.id}
					note={note}
					onPracticeClick={handleLessonClick}
				/>
			))}

			{selectedLesson && (
				<LessonOptionsModal
					{...lessonOptionsModal.props}
					lesson={selectedLesson}
				/>
			)}
		</section>
	);
}
