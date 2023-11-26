import { useState } from 'react';
import { useQuestionSet } from '../QuestionSetContext';
import { cn } from '../../../utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRightIcon,
    CheckIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export function InputName() {
    const {
        questionCount,
        answerCount,
        getCurrentQuestion,
        answerQuestion,
        goToNextQuestion,
    } = useQuestionSet();

    const question = getCurrentQuestion();

    const [nameEntered, setNameEntered] = useState<string>('');
    const [showAnswer, setShowAnswer] = useState(false);

    function handleVerifyClick() {
        setShowAnswer(true);
    }

    function handleContinueClick() {
        answerQuestion(nameEntered.trim() === question.answer);

        setNameEntered('');
        setShowAnswer(false);

        if (answerCount < questionCount) {
            goToNextQuestion();
        }
    }

    const isAnswer = nameEntered === question.answer;

    return (
        <section className="flex flex-1 flex-col gap-y-4">
            <h1 className="text-center text-3xl">Escribe el nombre</h1>

            <div className="relative overflow-hidden rounded-xl">
                <img
                    className="aspect-[1/1] w-full object-cover"
                    src={question.word.imgSrc}
                />

                <AnimatePresence>
                    {showAnswer && (
                        <motion.div
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={{
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                exit: { opacity: 0 },
                            }}
                            className={cn(
                                'absolute inset-0 flex flex-col items-center justify-center bg-transparent',
                                isAnswer
                                    ? 'bg-green-300/80 text-green-700'
                                    : 'bg-rose-300/80 text-rose-700'
                            )}
                        >
                            {isAnswer ? (
                                <CheckIcon className="h-72 w-72" />
                            ) : (
                                <XMarkIcon className="h-72 w-72" />
                            )}

                            <span className="text-5xl font-bold">
                                {question.answer}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <input
                className={cn(
                    'h-14 w-full rounded-xl border-2 border-solid border-transparent px-4 py-2 text-center text-xl text-gray-900 ring-2',
                    'focus:border-yellow-primary focus:outline-none focus:ring-yellow-primary',
                    showAnswer &&
                        (isAnswer
                            ? 'bg-green-300 text-green-700'
                            : 'bg-rose-300 text-rose-700')
                )}
                value={nameEntered}
                onChange={(e) => setNameEntered(e.target.value)}
                placeholder="Escribe aquí..."
            />

            {!showAnswer && (
                <VerifyButton
                    isOptionSelected={Boolean(nameEntered)}
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
                'h-14 w-full rounded-xl bg-gray-300 px-4 py-3 text-xl font-medium text-gray-400 shadow-sm transition-opacity hover:opacity-80',
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
