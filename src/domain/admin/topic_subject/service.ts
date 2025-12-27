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

    async createTopic(title: string, description?: string, subject_id?: number): Promise<Topic> {
        const res = await fetch(`${API_URL}/topics/create`, {
            method: "POST",
            headers: getHeaders(getToken()),
            body: JSON.stringify({ title, description, subject_id })
        });

        if (!res.ok) throw new Error("Tạo Topic thất bại");

        return (await res.json()).data;
    },

    async createSubject(name: string, subject_type: number): Promise<Subject> {
        const res = await fetch(`${API_URL}/subjects/create`, {
            method: "POST",
            headers: getHeaders(getToken()),
            body: JSON.stringify({ subject_name: name, subject_type: subject_type }),
        });

        if (!res.ok) throw new Error("Tạo Subject thất bại");
        return (await res.json()).data;
    },

    async deleteTopic(id: number): Promise<void> {
        const res = await fetch(`${API_URL}/topics/remove/${id}`, {
            method: "DELETE",
            headers: getHeaders(getToken()),
        });

        if (!res.ok) throw new Error("Xoá Topic thất bại");
    },

    async deleteSubject(id: number): Promise<void> {
        const res = await fetch(`${API_URL}/subjects/remove/${id}`, {
            method: "DELETE",
            headers: getHeaders(getToken()),
        });

        if (!res.ok) throw new Error("Xoá Subject thất bại");
    },

    async updateSubject(id: number, subject_name: string): Promise<Subject> {
        const res = await fetch(`${API_URL}/subjects/update/${id}`, {
            method: "PATCH",
            headers: getHeaders(getToken()),
            body: JSON.stringify({ subject_name })
        });
        if (!res.ok) throw new Error("Sửa Subject thất bại");
        return (await res.json()).data;
    },

    async updateTopic(id: number, payload: Partial<Topic>): Promise<Topic> {
        const res = await fetch(`${API_URL}/topics/update/${id}`, {
            method: "PATCH",
            headers: getHeaders(getToken()),
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Sửa Topic thất bại");

        return (await res.json()).data;
    },
}