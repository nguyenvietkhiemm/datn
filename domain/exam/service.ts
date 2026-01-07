import { getToken, getHeaders, API_URL, FilterSearch } from "../../lib/service";

export const ExamService = {
    // Lấy danh sách đề thi
    async getList(
        page: number = 1,
        filterCondition?: any,
        searchKeyword: string = ""
    ) {
        const token = getToken();
        let url = `${API_URL}/exams?page=${page}`;

        // apply filter + search
        url = FilterSearch(filterCondition, searchKeyword, url);
        
        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token),
        });

        const result = await res.json();

        if (Array.isArray(result?.data?.exams)) {
            const now = new Date(); // UTC internally

            result.data.exams.sort((a: any, b: any) => {
                const startA = new Date(a.start_time);
                const endA = new Date(a.end_time);
                const startB = new Date(b.start_time);
                const endB = new Date(b.end_time);

                const isRunningA = startA <= now && now <= endA;
                const isRunningB = startB <= now && now <= endB;

                // 1. Ưu tiên exam đang diễn ra
                if (isRunningA !== isRunningB) {
                    return isRunningA ? -1 : 1;
                }

                // 2. Ưu tiên số người tham gia (DESC)
                const countDiff =
                    Number(b.contestant_count) - Number(a.contestant_count);
                if (countDiff !== 0) return countDiff;

                // 3. Exam mới hơn (start_time DESC)
                return startB.getTime() - startA.getTime();
            });
        }

        return result;
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
        subject_type: number | null,
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

    async getRanking(exam_id: number, user_name: string, currentPage: number) {

        const params = new URLSearchParams({
            user_name,
            page: String(currentPage),
        });

        const res = await fetch(
            `${API_URL}/exams/${exam_id}/ranking?${params.toString()}`,
            {
                method: "GET",
                headers: getHeaders(getToken()),
            }
        );
        return await res.json();
    },

    async getExamHistory() {
        const token = getToken();
        const url = `${API_URL}/exams/exam-history`;

        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token)
        });

        return await res.json();
    },

    async checkDoExam(exam_id: number) {
        const token = getToken();
        const url = `${API_URL}/exams/check/do/user?exam_id=${exam_id}`;

        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token)
        });

        return await res.json();
    },

    async getUserAnswer(history_exam_id: number, exam_id: number) {
        const token = getToken();
        const res = await fetch(`${API_URL}/exams/user-answer?exam_id=${exam_id}&history_exam_id=${history_exam_id}`,
            {
                method: "GET",
                headers: getHeaders(token)
            }
        )
        return await res.json()
    }
};
