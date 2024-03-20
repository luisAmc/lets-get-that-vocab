import { useRouter } from 'next/router';
import { Page } from '../shared/Page';
import { RouterInputs, api } from '~/utils/api';
import {
	NumberQuestionSetProvider,
	useNumberQuestionSet,
} from './NumberQuestionSetProvider';
import { NumberAnswerProgress } from './NumberAnswerProgress';
import { NumberAnswerStatus } from './NumberAnswerStatus';
import { NumberResume } from './NumberResume';
import { NumberQuestionList } from './NumberQuestion/NumberQuestionList';

type QUERY_INPUT = RouterInputs['number']['getQuestionSet'];

export function NumberPractice() {
	const router = useRouter();
	const [questionSetSize, numberType, range, questionType] = [
		Number(router.query.questionSetSize as string),
		router.query.numberType as unknown as QUERY_INPUT['numberType'],
		router.query.range as unknown as QUERY_INPUT['range'],
		router.query.questionType as unknown as QUERY_INPUT['questionType'],
	];

	const { data, isLoading } = api.number.getQuestionSet.useQuery(
		{ questionSetSize, numberType, range, questionType },
		{
			enabled:
				!!router.isReady &&
				!!questionSetSize &&
				!!numberType &&
				!!range &&
				!!questionType,
			refetchOnWindowFocus: false,
		},
	);

	const questions = data ?? [];

	return (
		<Page>
			{isLoading && <Skeleton />}

			{data && (
				<NumberQuestionSetProvider questions={questions}>
					<div className="flex h-full w-full flex-col justify-center gap-y-4">
						<NumberAnswerProgress />
						<NumberAnswerStatus />
						<NumberQuestionsOrResume />
					</div>
				</NumberQuestionSetProvider>
			)}
		</Page>
	);
}

function NumberQuestionsOrResume() {
	const { answersCount, questionsCount } = useNumberQuestionSet();
	const isSetFinished = answersCount === questionsCount;

	return <>{isSetFinished ? <NumberResume /> : <NumberQuestionList />}</>;
}

function Skeleton() {
	return (
		<div className="flex h-full animate-pulse flex-col space-y-4 overflow-hidden rounded-xl">
			<div className="h-4 w-full rounded-full bg-brand-100"></div>

			<div className="h-8 w-full rounded-lg bg-brand-100"></div>

			<div className="flex flex-1 flex-col space-y-4 rounded-lg border border-brand-100 bg-white p-4">
				<div className="h-12 w-1/3 rounded-lg bg-brand-100 "></div>

				<div className="h-1/2 rounded-lg bg-brand-100"></div>

				<div className="flex-1"></div>

				<div className="h-16 w-full rounded-lg bg-brand-100"></div>
			</div>
		</div>
	);
}
