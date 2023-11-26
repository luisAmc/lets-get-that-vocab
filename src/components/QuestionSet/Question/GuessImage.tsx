import { useState } from 'react';
import { useQuestionSet } from '../QuestionSetContext';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';

export function GuessImage() {
    const {
        questionCount,
        answerCount,
        getCurrentQuestion,
        answerQuestion,
        goToNextQuestion,
    } = useQuestionSet();

    const question = getCurrentQuestion();

    const [selectedOption, setSelectedOption] = useState<number>(-1);
    const [showAnswer, setShowAnswer] = useState(false);

    function handleOptionClick(option: number) {
        setSelectedOption(option);
    }

    function handleVerifyClick() {
        // TODO: Fix this
        const parsedAnswer = parseInt(question.answer.toString(), 10);

        answerQuestion(selectedOption === parsedAnswer);
        setShowAnswer(true);
    }

    function handleContinueClick() {
        setSelectedOption(-1);
        setShowAnswer(false);

        if (answerCount < questionCount) {
            goToNextQuestion();
        }
    }

    return (
        <section className="flex flex-1 flex-col gap-y-4">
            <h1 className="text-center text-3xl">
                ¿Cúal de estos es "{' '}
                <span className="font-bold">{question.word.text}</span>"?
            </h1>

            <div className="flex items-center gap-2">
                {question.plausibleAnswers.map((option, optionIndex) => {
                    const isSelected = optionIndex === selectedOption;

                    // TODO: Fix this
                    const isAnswer = optionIndex.toString() === question.answer;

                    return (
                        <button
                            key={`option-${optionIndex}`}
                            className={cn(
                                'relative w-full overflow-hidden rounded-xl border-2 border-solid border-transparent bg-white shadow-md hover:opacity-80',
                                isSelected && 'border-yellow-primary'
                            )}
                            onClick={() => handleOptionClick(optionIndex)}
                        >
                            <img
                                src={option}
                                className="aspect-square w-full object-cover"
                            />

                            <div
                                className={cn(
                                    'absolute inset-0 bg-transparent',
                                    isSelected && 'bg-gray-200/75',
                                    showAnswer &&
                                        (isAnswer
                                            ? 'bg-green-500/75'
                                            : 'bg-rose-300/75')
                                )}
                            ></div>
                        </button>
                    );
                })}
            </div>

            {!showAnswer && (
                <VerifyButton
                    isOptionSelected={selectedOption >= 0}
                    onClick={handleVerifyClick}
                />
            )}

            {showAnswer && <ContinueButton onClick={handleContinueClick} />}
        </section>
    );
}

interface ContinueButtonProps {
    onClick(): void;
}

function ContinueButton({ onClick }: ContinueButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                'flex h-14 items-center justify-between gap-x-2 rounded-xl bg-gray-100 px-4 py-3 text-lg font-medium text-gray-500 transition-opacity ease-in hover:opacity-75'
            )}
            onClick={onClick}
        >
            <span>Siguiente</span>
            <ArrowRightIcon className="animate-bounce-horizontal h-6 w-6" />
        </button>
    );
}

interface VerifyButtonProps {
    isOptionSelected: boolean;
    onClick(): void;
}

function VerifyButton({ isOptionSelected, onClick }: VerifyButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!isOptionSelected}
            className={cn(
                'h-14 rounded-xl bg-gray-300 px-4 py-3 text-xl font-medium text-gray-400 shadow-sm transition-opacity hover:opacity-80',
                !isOptionSelected && 'cursor-not-allowed hover:opacity-100',
                isOptionSelected && 'bg-green-200 text-green-600'
            )}
        >
            <span>
                {isOptionSelected ? 'Verificar' : 'Seleccione una opción'}
            </span>
        </button>
    );
}
