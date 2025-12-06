export interface Answer {
    answer_id: number;
    answer_content: string;
    images?: string[];
    is_correct: boolean;
}

export interface Question {
    question_id: number;
    question_name: string;
    question_content: string;
    available: boolean;
    answers: Answer[];
    images?: string[];
    source: string;
    type_question?: number;
    point_type? : number
}

export interface FileInfo {
    id: number;
    name: string;
    url: string;
}
