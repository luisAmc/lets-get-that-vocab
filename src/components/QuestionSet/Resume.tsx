import Link from 'next/link';
import { useQuestionSet } from './QuestionSetContext';

export function Resume() {
	const { questions, answers } = useQuestionSet();

	return (
		<div className="flex h-full flex-col px-4">
			<h1 className="mb-10 text-center text-4xl font-medium">Resumen</h1>

			<div className="space-y-2 text-xl">
				{questions.map((question, questionIndex) => (
					<div
						key={`resume-item-${questionIndex}`}
						className="flex items-center justify-between"
					>
						<div>{question.word.text}</div>

						<div>
							{answers[questionIndex] === 1 ? 'Correcto' : 'Incorrecto'}
						</div>
					</div>
				))}
			</div>

			<div className="flex flex-1 items-end justify-center">
				<Link href="/">
					<button
						type="button"
						className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-4 text-2xl font-medium shadow-md transition-opacity hover:opacity-75"
					>
						¿Volver al incio?
					</button>
				</Link>
			</div>
		</div>
	);
}
