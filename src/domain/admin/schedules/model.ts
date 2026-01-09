import { ScheduleStatus } from "./type";

export const ScheduleModel = {
    getStatus(start: string, end: string): ScheduleStatus {
        const now = new Date();

        const startTime = new Date(start.replace('Z', ''));
        const endTime = new Date(end.replace('Z', ''));
        if (now < startTime) return "UPCOMING";
        if (now <= endTime) return "ONGOING";
        return "FINISHED";
    }

};
