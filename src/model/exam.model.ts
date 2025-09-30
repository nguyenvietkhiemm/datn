export interface Exam {
    exam_id: number;
    title: string;
    create_at: Date;
    time_limit: number; // in minutes
    topic_id: number;
    exam_schedule_id: number;
    available: boolean;
}