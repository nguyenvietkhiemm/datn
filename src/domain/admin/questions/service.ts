import { Question, Answer } from "./type";
import { API_URL, getHeaders, getToken } from "@/lib/service";

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
}