import { Answer } from "../questions/type";

export type Exam = {
    exam_id: number;
    exam_name: string;
    created_at: string;
    time_limit: number;
    topic_id: number;
    exam_schedule_id: number;
    available: boolean;
    title: string
};

export interface Question {
    question_id: number;
    question_name: string;
    question_content: string;
    available: boolean;
    answers: Answer[];
    sourrce?: string
}

export interface CsvFile {
    id: number;
    name: string;
    url: string;
}