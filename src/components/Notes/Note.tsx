import { Button } from '../shared/Button';
import { cn } from '~/utils/cn';
import { Disclosure } from '@headlessui/react';
import {
	DocumentTextIcon,
	SparklesIcon,
	VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '~/utils/transforms';
import { LessonType } from '../Practice/LessonOptionsModal';
import { RouterOutputs } from '~/utils/api';

interface NoteCardProps {
	note: RouterOutputs['note']['getAll'][number];
	onPracticeClick(clickedLesson: LessonType | null): void;
}

export function NoteCard({ note, onPracticeClick }: NoteCardProps) {
	return (
		<div className="rounded-xl bg-brand-100 px-4 py-3 shadow-sm">
			<Disclosure>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full flex-col gap-y-4 text-left">
							<div className="flex w-full items-center justify-between">
								<span className="text-xl font-medium">{note.name}</span>
								<span className="text-xs">{formatDate(note.date)}</span>
							</div>

							<div className="w-full">
								<pre className="rounded-lg bg-brand-200 p-4 text-sm text-brand-700">
									{note.adittionalNotes}
								</pre>
							</div>

							<div className="flex w-full items-center justify-evenly space-x-2">
								<span className="w-full border-b border-solid border-brand-300"></span>
								<span className="whitespace-nowrap text-sm font-semibold text-brand-500">
									{open ? 'Ver menos' : 'Ver más'}
								</span>
								<span className="w-full border-b border-solid border-brand-300"></span>
							</div>
						</Disclosure.Button>

						<Disclosure.Panel className="mt-4 flex flex-col gap-y-4">
							{note.relatedLesson && (
								<Button
									variant="secondary"
									onClick={() => onPracticeClick(note.relatedLesson)}
								>
									<SparklesIcon className="mr-1 h-4 w-4" />
									<span>Prácticar</span>
								</Button>
							)}

							<div
								className={cn(
									'grid gap-x-2',
									!!note.videoSrc ? 'grid-cols-2' : 'grid-cols-1',
								)}
							>
								{note.videoSrc && (
									<Button
										variant="secondary"
										href={note.videoSrc}
										target="_blank"
									>
										<VideoCameraIcon className="mr-1 h-4 w-4" />
										<span>Video de clase</span>
									</Button>
								)}

								<Button variant="secondary" href={note.fileSrc} target="_blank">
									<DocumentTextIcon className="mr-1 h-4 w-4" />
									<span>Notas (PDF)</span>
								</Button>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</div>
	);
}
