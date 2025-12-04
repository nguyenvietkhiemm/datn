import { getToken, getHeaders } from "@/lib/service";
import Cookies from "js-cookie";
import { API_URL } from "@/lib/service";
import { Subject, Topic } from "./type";

export const TopicSubjectService = {
    async fetchTopics(): Promise<Topic[]> {
        const token = Cookies.get("token");

        if (!token) {
            throw new Error("Không tìm thấy token xác thực.");
        }

        const headers = getHeaders(token);

        try {
            const res = await fetch(`${API_URL}/topics`, { headers });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Lỗi khi tải danh sách chủ đề.");
            }

            const dataTopic = await res.json();
            return dataTopic.data as Topic[];
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Topics:", error);
            throw error;
        }
    },

    async fetchSubjects(): Promise<Subject[]> {
        const token = Cookies.get("token");

        if (!token) {
            throw new Error("Không tìm thấy token xác thực.");
        }

        const headers = getHeaders(token);

        try {
            const res = await fetch(`${API_URL}/subjects`, { headers });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Lỗi khi tải danh sách môn học.");
            }

            const dataSubject = await res.json();
            return dataSubject.data as Subject[];
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Subjects:", error);
            throw error;
        }
    },
}