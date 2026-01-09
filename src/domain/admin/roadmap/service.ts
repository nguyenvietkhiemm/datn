import { getToken, getHeaders, API_URL } from "@/lib/service";
import { RoadmapStep } from "./type";

export const RoadMapService = {
    // Lấy danh sách roadmap
    async fetchRoadmap(): Promise<RoadmapStep[]> {
        const token = getToken();

        const res = await fetch(`${API_URL}/roadmap`, {
            method: "GET",
            headers: getHeaders(token),
        });

        if (!res.ok) throw new Error("Không thể lấy roadmap");

        const data = await res.json();
        return data.data;
    },

    // Tạo bước roadmap mới
    async addStep(form: any): Promise<RoadmapStep> {
        const token = getToken();

        const res = await fetch(`${API_URL}/roadmap/create`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Không thể tạo bước roadmap");
        const data = await res.json();
        return data.data
    },

    // Xoá bước
    async deleteStep(stepId: number): Promise<void> {
        const token = getToken();

        const res = await fetch(`${API_URL}/roadmap/remove/${stepId}`, {
            method: "DELETE",
            headers: getHeaders(token),
        });

        if (!res.ok) throw new Error("Không thể xoá bước");
    },

    // Cập nhật bước
    async updateStep(stepId: number, form: any): Promise<void> {
        const token = getToken();

        const res = await fetch(`${API_URL}/roadmap/update/${stepId}`, {
            method: "PATCH",
            headers: getHeaders(token),
            body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Không thể sửa bước roadmap");
    }
};
