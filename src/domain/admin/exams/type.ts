export type Exam = {
    exam_id: number;
    exam_name: string;
    created_at: string;
    time_limit: number;
    topic_id: number;
    exam_schedule_id: number;
    available: boolean;
    title: string;
    topic_name: string;
    start_time?: string;
    end_time?: string;
};

export interface CsvFile {
    id: number;
    name: string;
    url: string;
}

export interface ExamQuery {
    page: number;
    searchKeyword: string;
    subject_id?: number;
    topic_ids?: number;
    status?: "true" | "false" | "All";
}
