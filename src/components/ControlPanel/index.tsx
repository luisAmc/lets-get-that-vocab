import {
	ChevronLeftIcon,
	FolderOpenIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../shared/Button';
import { Page } from '../shared/Page';

export function WordCreation() {
	return (
		<Page>
			<div className="space-y-4">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-x-4">
						<Button variant="secondary" size="icon" href="/">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">Panel de control</h1>
					</div>
				</header>

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
			</div>
		</Page>
	);
}
