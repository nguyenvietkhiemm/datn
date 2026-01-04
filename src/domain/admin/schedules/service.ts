import { Exam } from "../exams/type";
import { ExamSchedule, ExamScheduleCreate } from "./type";
import { getHeaders, getToken, API_URL } from "@/lib/service";

export const ScheduleService = {

    // Lấy toàn bộ lịch thi
    async fetchSchedules() {
        const token = getToken();

        const res = await fetch(`${API_URL}/exams/schedule`, {
            method: "GET",
            headers: getHeaders(token),
        });

        if (!res.ok) throw new Error("Không thể lấy danh sách lịch thi");

        const data = await res.json();
        return data.data ;
    },

    // Lấy chi tiết 1 lịch thi
    async fetchScheduleDetail(id: number): Promise<ExamSchedule> {
        const token = getToken();

        const res = await fetch(`${API_URL}/exams/schedule/${id}`, {
            method: "GET",
            headers: getHeaders(token),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Không thể tải chi tiết lịch thi");

        return data.data as ExamSchedule;
    },

    // Tạo mới lịch thi
    async createSchedule(form: ExamScheduleCreate): Promise<void> {
        const token = getToken();

        const res = await fetch(`${API_URL}/exams/schedule/create`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Tạo lịch thi thất bại");
    }
};
