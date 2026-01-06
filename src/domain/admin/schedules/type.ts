import { Exam } from "../exams/type";
export type ExamSchedule = {
    exam_schedule_id: number;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
    total_exams: number;
    exams?: Exam[];
};

export type ExamScheduleCreate = {
    start_time: string;
    end_time: string;
};

export type ScheduleStatus = "UPCOMING" | "ONGOING" | "FINISHED";