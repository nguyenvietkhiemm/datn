import { ScheduleStatus } from "./type";

export const ScheduleModel = {
    getStatus(start: string, end: string): ScheduleStatus {
        const now = Date.now();
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();

        if (now < startTime) return "UPCOMING";
        if (now <= endTime) return "ONGOING";
        return "FINISHED";
    }
    
};
