import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useQuestionSet } from './QuestionSetContext';

export function AnswerCounters() {
    const {
        questionCount,
        answerCount,
        correctAnswerCount,
        incorrectAnswerCount,
    } = useQuestionSet();

    return (
        <section className="flex w-full items-center justify-evenly">
            <div className="flex items-center gap-x-1">
                <XCircleIcon className="h-6 w-6" />

                <span>{incorrectAnswerCount}</span>
            </div>

            <div className="flex items-center gap-x-1">
                <span className="text-5xl">{answerCount}</span>
                <span className="text-xl">/</span>
                <span className="text-2xl">{questionCount}</span>
            </div>

            <div className="flex items-center gap-x-1">
                <span>{correctAnswerCount}</span>

                <CheckCircleIcon className="h-6 w-6" />
            </div>
        </section>
    );
}
