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

export type Answer = {
    answer_id: number;
    answer_content: string;
    is_correct: boolean;
};

export type ExamSchedule = {
    exam_schedule_id: number;
    start_time: string;
    end_time: string;
};

export interface Topic {
    topic_id: number;
    title: string;
    description?: string;
    subject_id?: number | null;
    created_at: string;
}

export type Subject = {
    subject_id: number;
    subject_name: string;
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