import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useNumberQuestionSet } from './NumberQuestionSetProvider';

export function NumberAnswerStatus() {
	const { answers } = useNumberQuestionSet();

	return (
		<div className="relative flex w-full items-center justify-between">
			<div className="absolute w-full border-b-2 border-brand-400"></div>

			{answers.map((answer, answerIndex) => (
				<div
					key={`answer-status-${answerIndex}`}
					className="relative grid h-7 w-7 place-items-center rounded-full bg-brand-50 sm:h-8 sm:w-8"
				>
					{
						{
							[-1]: <span className="text-brand-400">{answerIndex + 1}</span>,
							[0]: <XCircleIcon className="text-red-500" />,
							[1]: <CheckCircleIcon className="text-green-500" />,
						}[answer]
					}
				</div>
			))}
		</div>
	);
}
