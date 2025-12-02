import { Question } from "./question.model";

export interface Exam {
    exam_id: number;
    exam_name: string;
    create_at: Date;
    questions?: Question[];
    time_limit: number; // in minutes
    topic_id: number;
    exam_schedule_id: number;
    available: boolean
}

export interface DoExam {
    question_id: number;
    user_answer: number;
    user_answer_content?: string
}