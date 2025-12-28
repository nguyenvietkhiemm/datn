import { Question, Answer, CreateQuestionPayload, QuestionQuery } from "./type";
import { API_URL, getHeaders, getToken } from "@/lib/service";

export const QuestionService = {
  async fetchQuestions(query: QuestionQuery): Promise<{ questions: Question[]; last_page: number }> {

    const token = getToken();
    const params = new URLSearchParams({
      page: query.page.toString(),
      available: query.available,
      type_question: query.type_question.toString(),
      keyword: query.keyword,
    });

    const res = await fetch(
      `${API_URL}/questions?${params.toString()}`,
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

  async uploadImages(
    files: (File | string)[]
  ): Promise<string[]> {
    const token = getToken();
    const formData = new FormData();

    const existedUrls: string[] = [];

    files.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      } else {
        existedUrls.push(file);
      }
    });

    let uploadedUrls: string[] = [];

    if (formData.has("images")) {
      const res = await fetch(`${API_URL}/file/images/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload  images failed");
      }

      const result = await res.json();

      //  LẤY ĐÚNG DATA
      uploadedUrls = result.data as string[];
    }

    return [...existedUrls, ...uploadedUrls];
  },

  async fetchQuestionExam(exam_id:number){
    const token = getToken();
    const res = await fetch(`${API_URL}/exams/${exam_id}/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
    const data = await res.json();
    return data.data;
  },

  async fetchQuestionBank(bank_id:number){
    const token = getToken();
    const res = await fetch(`${API_URL}/banks/${bank_id}/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
    const data = await res.json();
    return data.data;
  }
}