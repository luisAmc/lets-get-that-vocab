import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useQuestionSet } from './QuestionSetContext';

export function AnswerStatus() {
	const { answers } = useQuestionSet();

	return (
		<div className="relative flex w-full items-center justify-between">
			<div className="absolute w-full border-b-2 border-gray-50"></div>

			{answers.map((answer, answerIndex) => (
				<div
					key={`answer-status-${answerIndex}`}
					className="relative grid h-7 w-7 place-items-center rounded-full bg-gray-50 sm:h-8 sm:w-8"
				>
					{
						{
							[-1]: <span className="text-gray-300">{answerIndex + 1}</span>,
							[0]: <XCircleIcon className="text-red-500" />,
							[1]: <CheckCircleIcon className="text-green-500" />,
						}[answer]
					}
				</div>
			))}
		</div>
	);
}
