export type ExamSchedule = {
    exam_schedule_id: number;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
    exams?: Exam[];
};

export type ExamScheduleCreate = {
    start_time: string;
    end_time: string;
};

export type Exam = {
    exam_id: number;
    exam_name: string;
    created_at: string;
    time_limit: number;
    topic_id: number;
    exam_schedule_id?: number | null;
    available: boolean;
    title: string
};

