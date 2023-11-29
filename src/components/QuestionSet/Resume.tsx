import { useQuestionSet } from './QuestionSetContext';
import { Button } from '../shared/Button';

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
				<Button href="/" size="xl" className="w-full">
					Regresar al inicio
				</Button>
			</div>
		</div>
	);
}
