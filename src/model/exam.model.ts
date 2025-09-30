export interface Exam {
    exam_id: number;
    exam_name: string;
    create_at: Date;
    time_limit: number; // in minutes
    topic_id: number;
    exam_schedule_id: number;
}