import { Button } from '../shared/Button';
import { cn } from '~/utils/cn';
import { CreateLessonModal } from './Units/Lesson/CreateLessonModal';
import { CreateUnitModal } from './Units/Unit/CreateUnitModal';
import { Page } from '../shared/Page';
import { RouterOutputs, api } from '~/utils/api';
import { type ReactNode, useEffect, useState } from 'react';
import {
	ChevronRightIcon,
	FolderOpenIcon,
	PencilSquareIcon,
	PlusCircleIcon,
	QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

type TAB_OPTION = 'units' | 'notes';

export function WordCreation() {
	const [selectedTab, setSelectedTab] = useState<TAB_OPTION>('units');

	return (
		<Page size="desktop" to="/" title="Panel de control">
			<div className="flex flex-col gap-y-2">
				<Tabs
					selectedTab={selectedTab}
					onChange={(clickedTab: TAB_OPTION) => setSelectedTab(clickedTab)}
				/>

				{
					{
						['units']: <Units />,
						['notes']: <Notes />,
					}[selectedTab]
				}
			</div>

			<div className="flex flex-col gap-y-4">
				<Button
					href="/control-panel/units"
					variant="secondary"
					className="p-12"
				>
					<FolderOpenIcon className="mr-1 h-6 w-6" />
					<span className="text-xl">Unidades</span>
				</Button>

				<Button
					href="/control-panel/notes"
					variant="secondary"
					className="p-12"
				>
					<PencilSquareIcon className="mr-1 h-6 w-6" />
					<span className="text-xl">Notas</span>
				</Button>
			</div>
		</Page>
	);
}

interface TabsProps {
	selectedTab: TAB_OPTION;
	onChange: (clickedTab: TAB_OPTION) => void;
}

function Tabs({ selectedTab, onChange }: TabsProps) {
	return (
		<div className="max-w-max rounded-lg bg-gray-100 p-1.5">
			<button
				type="button"
				className={cn(
					'rounded-lg px-4 py-2 text-sm font-semibold text-gray-500',
					selectedTab === 'units' && 'bg-white text-gray-900 shadow',
				)}
				onClick={() => onChange('units')}
			>
				Unidades
			</button>

			<button
				type="button"
				className={cn(
					'rounded-lg px-4 py-2 text-sm font-semibold text-gray-500',
					selectedTab === 'notes' && 'bg-white text-gray-900 shadow',
				)}
				onClick={() => onChange('notes')}
			>
				Notas
			</button>
		</div>
	);
}

const unitsMap = new Map<string, RouterOutputs['unit']['getAll'][number]>();

function Units() {
	const unitsQuery = api.unit.getAll.useQuery();

	const units = unitsQuery.data ?? [];

	useEffect(() => {
		unitsQuery.data?.forEach((unit) => unitsMap.set(unit.id, unit));
		console.log('unitsQuery.data');
	}, [unitsQuery.data]);

	const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
	const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

	useEffect(() => {
		setSelectedLesson(null);
	}, [selectedUnit]);

	const lessonQuery = api.lesson.get.useQuery(
		{ id: selectedLesson! },
		{ enabled: !!selectedLesson },
	);

	const lesson = lessonQuery.data ?? null;

	return (
		<>
			{unitsQuery.isLoading && <div>cargando...</div>}

			{!unitsQuery.isLoading && (
				<div className="max-w-7xl md:rounded-lg md:border md:border-gray-200">
					<div className="flex w-full grid-cols-1 flex-col gap-y-4 md:grid md:grid-cols-3 md:gap-y-0 md:divide-x">
						<Panel title="Unidades">
							<CreateUnitModal />

							{units.length > 0 ? (
								units.map((unit) => (
									<button
										key={unit.id}
										type="button"
										className={cn(
											'flex w-full items-center justify-between rounded-md px-4 py-2 ',
											unit.id === selectedUnit
												? 'bg-gray-300'
												: 'hover:bg-gray-100',
										)}
										onClick={() => setSelectedUnit(unit.id)}
									>
										<span>{unit.name}</span>
										<ChevronRightIcon className="size-3" />
									</button>
								))
							) : (
								<div>No hay unidades</div>
							)}
						</Panel>

						{selectedUnit ? (
							<Panel title="Lecciones">
								<CreateLessonModal unitId={selectedUnit} />

								{(unitsMap.get(selectedUnit)?.lessons.length ?? 0) > 0 ? (
									unitsMap.get(selectedUnit)?.lessons.map((lesson) => (
										<button
											key={lesson.id}
											type="button"
											className={cn(
												'flex w-full items-center justify-between rounded-md px-4 py-2',
												lesson.id === selectedLesson
													? 'bg-gray-300'
													: 'hover:bg-gray-100',
											)}
											onClick={() => setSelectedLesson(lesson.id)}
										>
											<span>{lesson.name}</span>
											<ChevronRightIcon className="size-3" />
										</button>
									))
								) : (
									<div>No hay lecciones</div>
								)}
							</Panel>
						) : (
							<div
								className={cn(
									'flex flex-col items-center justify-center p-4',
									selectedUnit ? 'col-span-1' : 'col-span-2',
								)}
							>
								<QuestionMarkCircleIcon className="mb-2 size-10" />
								<h3 className="text-sm font-bold">Seleccione una unidad</h3>
								<p className="text-sm">
									Seleccione una unidad para ver sus lecciones.
								</p>
							</div>
						)}

						{selectedUnit &&
							(selectedLesson ? (
								<Panel title="Palabras / Frases">
									{lessonQuery.isLoading && <div>Cargando...</div>}

									<Button
										variant="secondary"
										href={`/control-panel/units/${selectedUnit}/${selectedLesson}/create-words`}
										className="w-full"
									>
										<PlusCircleIcon className="mr-1 size-4" />
										<span>Añadir palabras o frases</span>
									</Button>

									{!lessonQuery.isLoading &&
										lesson &&
										(lesson.words.length > 0 ? (
											<div>Palabras</div>
										) : (
											<div>No hay palabras</div>
										))}
								</Panel>
							) : (
								<div
									className={cn(
										'flex flex-col items-center justify-center p-4',
										selectedUnit ? 'col-span-1' : 'col-span-2',
									)}
								>
									<QuestionMarkCircleIcon className="mb-2 size-10" />
									<h3 className="text-sm font-bold">Seleccione una lección</h3>
									<p className="text-sm">
										Seleccione una lección para ver sus palabras / frases.
									</p>
								</div>
							))}
					</div>
				</div>
			)}
		</>
	);
}

interface PanelProps {
	title: string;
	children: ReactNode;
}

function Panel({ title, children }: PanelProps) {
	return (
		<div className="rounded-lg border p-4 md:rounded-none md:border-0">
			<h2 className="mb-4 border-b pb-2 text-sm font-semibold">{title}</h2>
			<div className="space-y-2">{children}</div>
		</div>
	);
}

function Notes() {
	return <div>Notes</div>;
}
