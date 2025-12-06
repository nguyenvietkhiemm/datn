import { Question, Answer } from "./type";
import { API_URL, getHeaders, getToken } from "@/lib/service";;
import { FileInfo } from "./type";

export const QuestionService = {
    async fetchQuestions(page: number): Promise<{ questions: Question[]; last_page: number }> {
        const token = getToken(); // Lấy token từ cookie hoặc localStorage
        const res = await fetch(`${API_URL}/questions?page=${page}`, {
            method: "GET",
            headers: getHeaders(token),
        });

        if (!res.ok) {
            throw new Error("Không thể lấy danh sách câu hỏi");
        }

        const data = await res.json();
        return {
            questions: data.data.question as Question[], // Trả về danh sách câu hỏi
            last_page: data.data.totalPages as number,  // Trả về số trang cuối
        };
    },

    // Xoá câu hỏi
    async deleteQuestion(questionId: number): Promise<void> {
        const token = getToken();
        const res = await fetch(`${API_URL}/questions/remove/${questionId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Xoá câu hỏi thất bại");

        return; // Không cần trả về gì
    },

    // Cập nhật trạng thái hiển thị câu hỏi
    async toggleQuestionAvailable(questionId: number, available: boolean): Promise<void> {
        const token = getToken();
        const res = await fetch(`${API_URL}/questions/setAvailable/${questionId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ available }),
        });

        if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

        return; // Không cần trả về gì
    },

    // Lấy danh sách CSV từ server
    async fetchCsvList(): Promise<FileInfo[]> {
        const token = getToken();
        const url = `${API_URL}/file/csv`;
        const res = await fetch(url, {
            headers: getHeaders(token),
        });

        if (!res.ok) throw new Error("Không thể lấy danh sách CSV");

        const data = await res.json();
        return data.data as FileInfo[]; // Trả về danh sách tệp CSV
    },

    async fetchContent(): Promise<FileInfo[]> {
        const token = getToken();
        if (!token) throw new Error("Token không tồn tại");
        const url = `${API_URL}/file/json`;
        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token),
        });

        if (!res.ok) throw new Error("Không tải được file từ server");

        const csvText = await res.json();
        return csvText.data as FileInfo[];
    },

    async uploadFile(uploadUrl: string, file: File): Promise<any> {
        const formData = new FormData();
        formData.append("file", file);
        const token = getToken();
        const res = await fetch(uploadUrl, {
            method: "POST",
            headers: getHeaders(token),
            body: formData,
        });

        if (!res.ok) throw new Error("Upload File thất bại");

        const data = await res.json();
        return data;
    },
}