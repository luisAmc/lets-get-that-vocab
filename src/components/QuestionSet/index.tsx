import { AnswerCounters } from './AnswerCounters';
import { AnswerStatus } from './AnswerStatus';
import { Header } from '../Header';
import { PrivacyScreen } from '../PrivacyScreen';
// import { Question } from './Question';
import { QuestionSetProvider, useQuestionSet } from './QuestionSetContext';
import { Resume } from './Resume';
import { Page } from '../Page';
import { Question } from './Question';
import { generateQuestionSet } from '~/utils/generateQuestionSet';

export function QuestionSet() {
    const questions = generateQuestionSet();

    return (
        <Page>
            <Header />

            <QuestionSetProvider questions={questions}>
                <div className="flex flex-1 flex-col items-center justify-center gap-y-6 w-full">
                    {/* <AnswerCounters /> */}
                    <AnswerStatus />

                    <QuestionOrResume />

                </div>
            </QuestionSetProvider>

            <PrivacyScreen />
        </Page>
    );
}

function QuestionOrResume() {
    const { answerCount, questionCount } = useQuestionSet();
    const isSetFinished = answerCount === questionCount;

    return (
        <div className="flex-1 w-full">
            {isSetFinished ? <Resume /> : <Question />}
        </div>
    );
}
