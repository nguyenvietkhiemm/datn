import { getHeaders, getToken, API_URL } from "@/lib/service";
import { Exam } from "./type";

export const ExamService = {
  // Fetch Exams
  async fetchExams(page: number, filterCondition: any, searchKeyword: string) {
    const token = getToken();
    let url = `${API_URL}/exams?page=${page}`;

    // Filter status
    if (filterCondition?.status) {
      url += `&status=${filterCondition.status}`;
    }

    // Filter topics
    if (filterCondition?.topics && filterCondition.topics.length > 0) {
      url += `&topics=${filterCondition.topics.join(",")}`;
    }

    // Search
    if (searchKeyword.trim().length > 0) {
      url += `&search=${encodeURIComponent(searchKeyword)}`;
    }

    const resExam = await fetch(url, {
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
};
