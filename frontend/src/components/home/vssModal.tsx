import { useEffect, useState } from 'react';

import type { VssQuestionnaireQuestion, VssSubmissionResponse } from '../../interfaces/user.interface';
import { getVssQuestionnaire, submitVssQuestionnaire } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import Modal from '../ui/modal';

export type Language = 'fr' | 'en';

const copy = {
    fr: {
        title: 'Questionnaire VSS',
        toggleLanguage: 'Show in English',
        intro: [
            'Dans ce questionnaire, tu devras répondre aux questions ci-dessous à propos des Violences Sexistes et Sexuelles (VSS).',
            "La note est sur 14 et tu disposes de deux essais pour obtenir au moins 7 points. Cette sensibilisation est très importante pour nous afin de nous assurer que l'intégration se déroule dans les meilleures conditions pour tout le monde.",
            "Si tu n'arrives pas à obtenir la moyenne après deux tentatives, nous serons malheureusement contraints de te refuser l'accès à la Soirée et au Week-end d'intégration, car ce sont les moments où la majorité des situations de VSS se produisent.",
            'Tu peux quitter ce questionnaire à tout moment et le compléter plus tard. Cependant, il est obligatoire pour participer à certaines activités.',
        ],
        answerGuidance: {
            single: 'Choisis une seule réponse.',
            multiple: 'Tu peux sélectionner plusieurs réponses.',
        },
        loadingError: 'Impossible de charger le questionnaire VSS.',
        submitError: 'Impossible d’envoyer le questionnaire VSS.',
        unansweredError: "Réponds à toutes les questions avant d'envoyer le questionnaire.",
        emptyState: 'Aucun questionnaire disponible pour le moment.',
        progress: (answered: number, total: number) => `${answered}/${total} questions répondues`,
        points: (totalPoints: number) => `${totalPoints} points possibles`,
        submit: 'Soumettre le questionnaire',
        submitting: 'Envoi...',
        cancel: 'Annuler',
        close: 'Fermer',
        status: {
            validated: 'Questionnaire validé. Tu peux fermer cette fenêtre.',
            toretry: 'Le résultat nécessite une seconde tentative. Tu pourras retenter plus tard.',
            rejected: 'Le nombre de tentatives autorisées est atteint.',
            pending: '',
        },
    },
    en: {
        title: 'VSS Questionnaire',
        toggleLanguage: 'Voir en français',
        intro: [
            'In this questionnaire, you will need to answer the questions below about sexist and sexual violence (VSS).',
            'The score is out of 14 and you have two tries to get at least 7 points. This awareness step is very important to us so that the integration runs in the best possible conditions for everyone.',
            'If you do not reach the passing score after two attempts, we will unfortunately have to deny you access to the Party and the Integration Weekend, because these are the moments where most VSS situations happen.',
            'You can leave this questionnaire at any time and complete it later. However, it is mandatory to participate in certain activities.',
        ],
        answerGuidance: {
            single: 'Choose one answer only.',
            multiple: 'You can select multiple answers.',
        },
        loadingError: 'Unable to load the VSS questionnaire.',
        submitError: 'Unable to submit the VSS questionnaire.',
        unansweredError: 'Answer all the questions before submitting the questionnaire.',
        emptyState: 'No questionnaire is available right now.',
        progress: (answered: number, total: number) => `${answered}/${total} questions answered`,
        points: (totalPoints: number) => `${totalPoints} possible points`,
        submit: 'Submit questionnaire',
        submitting: 'Submitting...',
        cancel: 'Cancel',
        close: 'Close',
        status: {
            validated: 'Questionnaire validated. You can close this window.',
            toretry: 'The result requires a second attempt. You will be able to try again later.',
            rejected: 'The maximum number of attempts has been reached.',
            pending: '',
        },
    },
} as const;

interface VssModalProps {
    visible: boolean;
    onCancel: () => void;
    language: Language;
    onToggleLanguage: () => void;
    onSubmitted?: (result: VssSubmissionResponse) => void;
}

const getAnswerClassName = (selected: boolean) =>
    `rounded-xl border px-4 py-3 text-left transition ${
        selected
            ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100'
            : 'border-border/60 bg-white hover:border-blue-300 hover:bg-blue-50/60 dark:border-white/10 dark:bg-neutral-900 dark:hover:border-blue-500/60 dark:hover:bg-blue-950/20'
    }`;

const VssQuestionBlock = ({
    question,
    language,
    selectedAnswerIds,
    onSelect,
}: {
    question: VssQuestionnaireQuestion;
    language: Language;
    selectedAnswerIds: number[];
    onSelect: (questionId: number, answerId: number, type: VssQuestionnaireQuestion['type']) => void;
}) => {
    const localizedQuestion = language === 'en' && question.questionEn ? question.questionEn : question.question;

    return (
        <div className="rounded-2xl border border-border/60 bg-slate-50/80 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/70">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Question {question.id}</p>
                    <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-50">
                        {localizedQuestion}
                    </h3>
                </div>
                <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-900 dark:bg-blue-950/60 dark:text-blue-100">
                    {question.points} point{question.points > 1 ? 's' : ''}
                </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                {question.answers.map((answer) => {
                    const isSelected = selectedAnswerIds.includes(answer.id);
                    const localizedAnswer = language === 'en' && answer.answerEn ? answer.answerEn : answer.answer;

                    return (
                        <button
                            key={answer.id}
                            type="button"
                            className={getAnswerClassName(isSelected)}
                            onClick={() => onSelect(question.id, answer.id, question.type)}>
                            <span className="block text-sm font-medium">{localizedAnswer}</span>
                        </button>
                    );
                })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
                {question.type === 'single_choice'
                    ? copy[language].answerGuidance.single
                    : copy[language].answerGuidance.multiple}
            </p>
        </div>
    );
};

function VssModal({ visible, onCancel, onSubmitted, language, onToggleLanguage }: VssModalProps) {
    const [questions, setQuestions] = useState<VssQuestionnaireQuestion[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<VssSubmissionResponse | null>(null);
    const localizedCopy = copy[language];

    useEffect(() => {
        if (!visible) {
            setQuestions([]);
            setSelectedAnswers({});
            setError(null);
            setResult(null);
            setSubmitting(false);
            return;
        }

        let cancelled = false;

        const loadQuestionnaire = async () => {
            setError(null);
            setResult(null);

            try {
                const questionnaire = await getVssQuestionnaire();

                if (cancelled) {
                    return;
                }

                setQuestions(questionnaire);
                setSelectedAnswers({});
            } catch {
                if (!cancelled) {
                    setError(localizedCopy.loadingError);
                }
            }
        };

        loadQuestionnaire();

        return () => {
            cancelled = true;
        };
    }, [visible]);

    const handleSelectAnswer = (questionId: number, answerId: number, type: VssQuestionnaireQuestion['type']) => {
        setSelectedAnswers((currentAnswers) => {
            const existingAnswers = currentAnswers[questionId] ?? [];

            if (type === 'single_choice') {
                return {
                    ...currentAnswers,
                    [questionId]: [answerId],
                };
            }

            const hasAnswer = existingAnswers.includes(answerId);
            return {
                ...currentAnswers,
                [questionId]: hasAnswer
                    ? existingAnswers.filter((currentAnswerId) => currentAnswerId !== answerId)
                    : [...existingAnswers, answerId],
            };
        });
    };

    const handleSubmit = async () => {
        setError(null);
        setSubmitting(true);

        try {
            const unansweredQuestions = questions.filter((question) => {
                const currentAnswers = selectedAnswers[question.id] ?? [];
                return currentAnswers.length === 0;
            });

            if (unansweredQuestions.length > 0) {
                setError(localizedCopy.unansweredError);
                return;
            }

            const result = await submitVssQuestionnaire({
                answers: questions.map((question) => ({
                    questionId: question.id,
                    answerIds: selectedAnswers[question.id] ?? [],
                })),
            });

            setResult(result);
            onSubmitted?.(result);
        } catch {
            setError(localizedCopy.submitError);
        } finally {
            setSubmitting(false);
        }
    };

    const answeredCount = questions.filter((question) => (selectedAnswers[question.id] ?? []).length > 0).length;
    const totalQuestions = questions.length;

    const statusMessage = result ? localizedCopy.status[result.status] : null;

    return (
        <Modal
            title={localizedCopy.title}
            visible={visible}
            onCancel={onCancel}
            buttons={null}
            containerClassName="max-w-4xl">
            <div className="flex flex-col gap-5">
                <div className="flex justify-end">
                    <Button variant="secondary" onClick={onToggleLanguage}>
                        {localizedCopy.toggleLanguage}
                    </Button>
                </div>

                {localizedCopy.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100">
                        {error}
                    </div>
                )}

                {result && (
                    <div
                        className={`rounded-xl border px-4 py-3 text-sm ${
                            result.status === 'validated'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100'
                                : result.status === 'toretry'
                                  ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100'
                                  : 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100'
                        }`}>
                        <p className="font-semibold">{statusMessage}</p>
                        {result.maxScore > 0 && (
                            <p className="mt-1">
                                Score obtenu : {result.score}/{result.maxScore}
                            </p>
                        )}
                    </div>
                )}

                {questions.length > 0 && (
                    <div className="space-y-4 pr-1">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{localizedCopy.progress(answeredCount, totalQuestions)}</span>
                            <span>
                                {localizedCopy.points(
                                    questions.reduce((total, question) => total + question.points, 0),
                                )}
                            </span>
                        </div>

                        {questions.map((question) => (
                            <VssQuestionBlock
                                key={question.id}
                                question={question}
                                language={language}
                                selectedAnswerIds={selectedAnswers[question.id] ?? []}
                                onSelect={handleSelectAnswer}
                            />
                        ))}
                    </div>
                )}

                {questions.length === 0 && !error && (
                    <div className="rounded-xl border border-dashed border-border/60 bg-slate-50 px-4 py-8 text-center text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-900/60">
                        {localizedCopy.emptyState}
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    {result ? (
                        <Button onClick={onCancel}>{localizedCopy.close}</Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={onCancel}>
                                {localizedCopy.cancel}
                            </Button>
                            <Button onClick={handleSubmit} disabled={submitting || questions.length === 0}>
                                {submitting ? localizedCopy.submitting : localizedCopy.submit}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default VssModal;
