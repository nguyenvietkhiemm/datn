import { Exam } from "./type";
import { getToken, getHeaders, API_URL, FilterSearch } from "../../lib/service";

export const ExamService = {
    // Lấy danh sách đề thi
    async getList(page: number = 1, filterCondition?: any, searchKeyword: string = "") {
        const token = getToken();
        let url = `${API_URL}/exams?page=${page}`;

        // Dùng hàm FilterSearch của bạn
        url = FilterSearch(filterCondition, searchKeyword, url);

        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token)
        });

        return await res.json();
    },

    // Lấy chi tiết bài thi + câu hỏi
    async getExamDetail(exam_id: number) {
        const token = getToken();

        const res = await fetch(`${API_URL}/exams/${exam_id}`, {
            method: "GET",
            headers: getHeaders(token)
        });

        return await res.json();
    },

    // Nộp bài thi
    async submit(
        exam_id: number,
        subject_type: number,
        used_time: number,
        do_exam: {
            question_id: number;
            user_answer: (number | string)[]
        }[],
        user_name: string
    ) {
        const token = getToken();

        const url = `${API_URL}/exams/submit?exam_id=${exam_id}&subject_type=${subject_type}&time_test=${used_time}&user_name=${user_name}`;

        const res = await fetch(url, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify({ do_exam })
        });

        return await res.json();
    },

    async getRanking(exam_id: number, user_name: string) {

        const res = await fetch(`${API_URL}/exams/${exam_id}/ranking?user_name=${user_name}`, {
            method: "GET",
            headers: getHeaders(getToken())
        }
        );
        return await res.json();
    },

    async getExamHistory(user_name : string, exam_id : number) {
        const token = getToken();
        const url = `${API_URL}/exams/user/${user_name}/exam-history?exam_id=${exam_id}`;

        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token)
        });

        return await res.json();
    },

    async checkDoExam(exam_id : number){
        const token = getToken();
        const url = `${API_URL}/exams/check/do/user?exam_id=${exam_id}`;

        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token)
        });

        return await res.json();
    },

    async getUserAnswer(history_exam_id : number, exam_id : number){
        const token = getToken();
        const res = await fetch(`${API_URL}/exams/user-answer?exam_id=${exam_id}&history_exam_id=${history_exam_id}`,
            {
                method : "GET",
                headers : getHeaders(token)
            }
        )
        return res.json()
    }
};
