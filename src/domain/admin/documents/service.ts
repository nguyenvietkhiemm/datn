import { getHeaders, getToken, API_URL } from "@/lib/service";
import { Document, DocumnetQuery } from "./types";

export const DocumentService = {
    async fetchDocuments(query: DocumnetQuery) {
        const token = getToken();

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

        const res = await fetch(`${API_URL}/documents?${params.toString()}`, {
            method: "GET",
            headers: getHeaders(token),
        });

        if (!res.ok) {
            throw new Error("Không thể lấy danh sách tài liệu");
        }

        const data = await res.json();
        return {
            documents: data.data.documents as Document[],
            last_page: data.data.totalPages as number,
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

    async vectorize(files: { document_id: number; link: string }[]) {
        const token = getToken();

        const res = await fetch(`${API_URL}/microservice/llm/vectorize`, {
            method: "POST",
            headers: {
                ...getHeaders(token),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                files,
            }),
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Vectorize thất bại: ${error}`);
        }

        return res.json(); // nếu backend có trả kết quả
    },
};