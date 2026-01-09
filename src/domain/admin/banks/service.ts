import {Bank, BankQuery}from  "./type";
import { API_URL, getHeaders, getToken } from "@/lib/service";

export const BankService = {
    async fecthBank(query: BankQuery) {
        const token = getToken();
        console.log(query);

        const params = new URLSearchParams();

        // bắt buộc
        params.append("page", query.page.toString());

        // optional
        if (query.searchKeyword) {
            params.append("keyword", query.searchKeyword);
        }

        if (query.subject_id) {
            params.append("subject_id", query.subject_id.toString());
        }

        if (query.topic_ids) {
            params.append("topic_ids", query.topic_ids.toString())
        }

        if (query.status) {
            params.append("available", query.status);
        }

        const res = await fetch(
            `${API_URL}/banks?${params.toString()}`,
            {
                method: "GET",
                headers: getHeaders(token),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error("Không thể lấy danh sách bài luyện tập");
        }

        return {
            banks: data.data.banks as Bank[],
            totalPages: data.data.totalPages as number,
        };
    },

    // Delete Exam
    async deleteBank(bank_id: number) {
        const token = getToken();
        const res = await fetch(`${API_URL}/banks/remove/${bank_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Xoá bài thi thất bại");
        }
    },

    // Toggle Exam Available
    async toggleExamAvailable(bank_id: number, available: boolean) {
        const token = getToken();
        const res = await fetch(`${API_URL}/banks/setAvailable/${bank_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ available }),
        });

        if (!res.ok) {
            throw new Error("Cập nhật trạng thái thất bại");
        }

        return res.json();
    },

    async createBank(payload: {
        description: string;
        time_limit: number;
        topic_id: number;
        subject_id: number;
    }) {
        const token = getToken();

        const res = await fetch(`${API_URL}/banks/create`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Lỗi khi tạo bài thi!");
        }

        return data.data;
    },
}