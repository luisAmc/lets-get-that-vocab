import { RouterOutputs } from '~/utils/api';
import { formatDate } from '~/utils/transforms';

interface NoteProps {
	note: RouterOutputs['note']['getAll'][number];
}

export function Note({ note }: NoteProps) {
	return (
		<div className="flex items-center justify-between rounded-lg bg-brand-100 px-4 py-3">
			<span>{note.name}</span>
			<span className="text-sm">{formatDate(note.date)}</span>
		</div>
	);
}
