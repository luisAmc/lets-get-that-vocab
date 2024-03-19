import { useNumberQuestionSet } from './NumberQuestionSetProvider';

export function NumberAnswerProgress() {
	const { correctAnswersCount, incorrectAnswersCount, questionsCount } =
		useNumberQuestionSet();

	const correctPercentage = (
		(correctAnswersCount / questionsCount) *
		100
	).toFixed(0);

	const incorrectPercentage = (
		(incorrectAnswersCount / questionsCount) *
		100
	).toFixed(0);

	return (
		<div>
			<div className="relative flex h-4 w-full items-center justify-between overflow-hidden rounded-full bg-brand-100">
				<div
					className="absolute left-0 grid h-full place-items-center bg-green-500 text-xs text-green-50"
					style={{ width: `${correctPercentage}%` }}
				>
					{correctPercentage}%
				</div>

				<div
					className="absolute right-0 grid h-full place-items-center bg-red-500 text-xs text-red-50"
					style={{ width: `${incorrectPercentage}%` }}
				>
					{incorrectPercentage}%
				</div>
			</div>
		</div>
	);
}
