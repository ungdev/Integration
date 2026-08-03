export type VssQuestionnaireAnswer = {
    id: number;
    answer: string;
    answerEn?: string;
};

export type VssQuestionnaireQuestion = {
    id: number;
    question: string;
    questionEn?: string;
    points: number;
    type: 'single_choice' | 'multiple_choice';
    answers: VssQuestionnaireAnswer[];
};

export type VssSubmissionAnswer = {
    questionId: number;
    answerIds: number[];
};
