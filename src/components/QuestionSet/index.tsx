import { AnswerStatus } from './AnswerStatus';
import { api } from '~/utils/api';
import { Header } from '../shared/Header';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { QuestionList } from './Question/QuestionList';
import { QuestionSetProvider, useQuestionSet } from './QuestionSetContext';
import { Resume } from './Resume';
import { useRouter } from 'next/router';
import { AnswerProgress } from './AnswerProgress';
import { Loading } from '../shared/Loading';

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
			{/* <Header /> */}

			{isLoading && <Loading />}

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

			<PrivacyScreen />
		</Page>
	);
}

function QuestionsOrResume() {
	const { answerCount, questionCount } = useQuestionSet();
	const isSetFinished = answerCount === questionCount;

	return <>{isSetFinished ? <Resume /> : <QuestionList />}</>;
}
