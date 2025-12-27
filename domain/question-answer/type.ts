export interface Answer {
    answer_id: number;
    question_id: number;
    answer_content: string;
    is_correct: boolean | null;
    images: string[];
  }
  
export interface Question {
    question_id: number;
    question_name: string | null;
    question_content: string;
    embedding: string | null;
    image: string | null;
    type_question: number;
    source: string;
    available: boolean;
    images: string[];
    answers: Answer[];
  }

export type ReviewQuestion = {
    question_id: number;
    question_content: string;
    type_question: number;
    images? : [];
    correct_answers: {
        answer_id: number;
        answer_content: string;
        images: []
    }[];
};

export type UserAnswerMap = {
    [question_id: number]: {
        answer_id: number[];
        user_answer_text: string | null;
    };
};

