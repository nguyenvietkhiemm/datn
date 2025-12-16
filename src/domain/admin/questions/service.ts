import { Question, Answer, CreateQuestionPayload } from "./type";
import { API_URL, getHeaders, getToken } from "@/lib/service";

export const QuestionService = {
    async fetchQuestions(page: number, available: boolean, type_question: number): Promise<{ questions: Question[]; last_page: number }> {
        console.log(available);

        const token = getToken(); // Lấy token từ cookie hoặc localStorage
        const res = await fetch(
            `${API_URL}/questions?page=${page}&available=${available}&type_question=${type_question}`,
            {
                method: "GET",
                headers: getHeaders(token),
            }
        );
        if (!res.ok) {
            throw new Error("Không thể lấy danh sách câu hỏi");
        }

        const data = await res.json();
        return {
            questions: data.data.question as Question[], // Trả về danh sách câu hỏi
            last_page: data.data.totalPages as number,  // Trả về số trang cuối
        };
    },

    async createQuestionWithAnswers(payload: CreateQuestionPayload) {
        const token = getToken();

        const res = await fetch(`${API_URL}/questions/create`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Tạo câu hỏi thất bại");
        }

        return data;
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

    async uploadQuestionImages(files: File[]): Promise<string[]> {
        const token = getToken()

        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        const res = await fetch(`${API_URL}/upload/images`, {
            method: "POST",
            headers: getHeaders(token),
            body: formData,
        });

        const data = await res.json();
        return data.urls; // ["img1.png", "img2.png"]
    }

}