export interface Answer {
    answer_id: number;
    answer_content: string;
    images?: string[];
    is_correct: boolean;
}

export interface Question {
    question_id: number;
    question_content: string;
    available: boolean;
    answers: Answer[];
    images?: string[];
    source: string;
    type_question?: number;
    point_type?: number
}

export type CreateQuestionPayload =
    Omit<Question, "question_id" | "answers" | "images"> & {
        answers: Omit<Answer, "answer_id" | "images">[];
        images?: string[];
    };

export type AnswerForm = Omit<Answer, "answer_id" | "images">;

export type QuestionForm = {
    question_content: string;
    available: boolean;
    source: string;
    type_question: number;
};
