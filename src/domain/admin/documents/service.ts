import { getHeaders, getToken, API_URL } from "@/lib/service";
import { Document } from "./types";

export const DocumentService = {
    async fetchDocuments(page: number) {
        const token = getToken();
        const res = await fetch(`${API_URL}/documents?page=${page}`, {
            method: "GET",
            headers: getHeaders(token),
        });

        if (!res.ok) {
            throw new Error("Không thể lấy danh sách tài liệu");
        }

        const data = await res.json();
        return {
            documents: data.data.document as Document[],
            last_page: data.data.last_page as number,
        };
    },

    async deleteDocument(docId: number) {
        const token = getToken();
        const res = await fetch(`${API_URL}/documents/remove/${docId}`, {
            method: "DELETE",
            headers: getHeaders(token),
        });

        if (!res.ok) {
            throw new Error("Xoá tài liệu thất bại");
        }
    },

    async toggleDocumentAvailable(docId: number, available: boolean) {
        const token = getToken();
        const res = await fetch(`${API_URL}/documents/setAvailable/${docId}`, {
            method: "PATCH",
            headers: getHeaders(token),
            body: JSON.stringify({ available }),
        });

        if (!res.ok) {
            throw new Error("Cập nhật trạng thái thất bại");
        }
    },

    async create(title: string, topicId: number, file: File): Promise<void> {
        const token = getToken();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("topic_id", topicId.toString());
        formData.append("file", file);

        const res = await fetch(`${API_URL}/documents/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Lỗi khi tải tài liệu!");
        }
        return data;
    },
};