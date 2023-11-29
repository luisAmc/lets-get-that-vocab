import { AnswerStatus } from './AnswerStatus';
import { api } from '~/utils/api';
import { Header } from '../shared/Header';
import { Page } from '../shared/Page';
import { PrivacyScreen } from '../shared/PrivacyScreen';
import { Question } from './Question';
import { QuestionSetProvider, useQuestionSet } from './QuestionSetContext';
import { Resume } from './Resume';
import { useRouter } from 'next/router';
import { AnswerProgress } from './AnswerProgress';

export function QuestionSet() {
	const router = useRouter();

	const { data } = api.lesson.getQuestionSet.useQuery(
		{
			lessonId: router.query.lessonId as string,
			questionTypes: router.query.questionTypes as string,
			questionSetSize: parseInt(router.query.questionSetSize as string, 10),
		},
		{ refetchOnWindowFocus: false },
	);

	const questions = data ?? [];

	return (
		<Page>
			{/* <Header /> */}

			{data && (
				<QuestionSetProvider questions={questions}>
					<div className="flex h-full w-full flex-col justify-center gap-y-4">
						{/* <AnswerCounters /> */}
						<AnswerProgress />

						<AnswerStatus />

						<QuestionOrResume />
					</div>
				</QuestionSetProvider>
			)}

			<PrivacyScreen />
		</Page>
	);
}

function QuestionOrResume() {
	const { answerCount, questionCount } = useQuestionSet();
	const isSetFinished = answerCount === questionCount;

	return <>{isSetFinished ? <Resume /> : <Question />}</>;
}
