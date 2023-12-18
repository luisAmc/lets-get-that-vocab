import { AnswerStatus } from './AnswerStatus';
import { api } from '~/utils/api';
import { Page } from '../shared/Page';
import { QuestionList } from './Question/QuestionList';
import { QuestionSetProvider, useQuestionSet } from './QuestionSetContext';
import { Resume } from './Resume';
import { useRouter } from 'next/router';
import { AnswerProgress } from './AnswerProgress';

export function QuestionSet() {
	const router = useRouter();
	const [lessonId, questionTypes, questionSetSize] = [
		router.query.lessonId as string,
		router.query.questionTypes as string,
		parseInt(router.query.questionSetSize as string, 10),
	];

	const { data, isLoading } = api.lesson.getQuestionSet.useQuery(
		{ lessonId, questionTypes, questionSetSize },
		{
			enabled:
				router.isReady && !!lessonId && !!questionTypes && !!questionSetSize,
			refetchOnWindowFocus: false,
		},
	);

	const questions = data ?? [];

	return (
		<Page>
			{isLoading && <Skeleton />}

			{data && (
				<QuestionSetProvider questions={questions}>
					<div className="flex h-full w-full flex-col justify-center gap-y-4">
						{/* <AnswerCounters /> */}
						<AnswerProgress />

						<AnswerStatus />

						<QuestionsOrResume />
					</div>
				</QuestionSetProvider>
			)}
		</Page>
	);
}

function QuestionsOrResume() {
	const { answerCount, questionCount } = useQuestionSet();
	const isSetFinished = answerCount === questionCount;

	return <>{isSetFinished ? <Resume /> : <QuestionList />}</>;
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
