import { getHeaders, getToken, API_URL } from "@/lib/service";
import { Exam } from "./type";
import { FilterSearch } from "@/lib/service";

export const ExamService = {
  // Fetch Exams
  async fetchExams(page: number, filterCondition: any, searchKeyword: string) {
    const token = getToken();
    let url = `${API_URL}/exams?page=${page}`;

    const link = FilterSearch(filterCondition, searchKeyword, url)

    const resExam = await fetch(link, {
      method: "GET",
      headers: getHeaders(token),
    });

    const data = await resExam.json();

    if (!resExam.ok) {
      throw new Error("Không thể lấy danh sách bài thi");
    }

    return {
      exams: data.data.exams as Exam[],
      totalPages: data.data.totalPages as number,
    };
  },

  // Delete Exam
  async deleteExam(examId: number) {
    const token = getToken();
    const res = await fetch(`${API_URL}/exams/remove/${examId}`, {
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
  async toggleExamAvailable(examId: number, available: boolean) {
    const token = getToken();
    const res = await fetch(`${API_URL}/exams/setAvailable/${examId}`, {
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

  async createExam(payload: {
    exam_name: string;
    time_limit: number;
    topic_id: number;
    subject_id: number;
    exam_schedule_id: number;
  }) {
    const token = getToken();

    const res = await fetch(`${API_URL}/exams/create`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Lỗi khi tạo bài thi!");
    }

    return data;
  },
};
