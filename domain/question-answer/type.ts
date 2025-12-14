export type Answer = {
    answer_id: number;
    answer_content: string;
    is_correct: boolean;
};

export type Question = {
    question_id: number;
    question_name: string;
    question_content: string;
    answers: Answer[];
    type_question: number
};

export type ReviewQuestion = {
    question_id: number;
    question_content: string;
    type_question: number;
    correct_answers: {
        answer_id: number;
        answer_content: string;
    }[];
};

export type UserAnswerMap = {
    [question_id: number]: {
        answer_id: number[];
        user_answer_text: string | null;
    };
};

