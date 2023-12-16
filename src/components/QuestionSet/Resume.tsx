import { useQuestionSet } from './QuestionSetContext';
import { Button } from '../shared/Button';
import {
	ArrowPathIcon,
	CheckIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '~/utils/cn';

export function Resume() {
	const { questions, answers } = useQuestionSet();

	return (
		<div className="flex h-full flex-col gap-y-4 rounded-xl border border-brand-200 bg-white p-4">
			<h1 className="mb-10 text-center text-4xl font-medium">Resumen</h1>

			<div className="space-y-2 px-4 text-xl">
				<table className="w-full divide-y divide-gray-300">
					<thead>
						<tr>
							<th className="py-2.5 pl-4 pr-3 text-sm font-semibold text-gray-600">
								#
							</th>
							<th className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600">
								Palabra / Frase
							</th>
							<th className="py-2.5 pl-3 pr-4 text-left text-sm font-semibold text-gray-600">
								Respuesta
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-200">
						{questions.map((question, questionIndex) => (
							<tr key={`resume-row-${questionIndex}`}>
								<td className="py-21.5pl-4 text-center text-sm text-gray-500">
									{questionIndex + 1}
								</td>

								<td className="px-3 py-1.5 text-sm text-gray-500">
									{question.word.text}
								</td>

								<td
									className={cn(
										'flex items-center gap-x-1 py-1.5 pl-3 pr-4 text-sm',
										answers[questionIndex] === 1
											? 'text-green-600'
											: 'text-red-500',
									)}
								>
									{answers[questionIndex] === 1 ? (
										<>
											<span>Correcto</span>
											<CheckIcon className="h-4 w-4" />
										</>
									) : (
										<>
											<span>Incorrecto</span>
											<XMarkIcon className="h-4 w-4" />
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex-1"></div>

			<Button href="/practice" size="xl" className="w-full">
				<ArrowPathIcon className="mr-2 h-5 w-5" />
				<span>Entendido</span>
			</Button>
		</div>
	);
}
