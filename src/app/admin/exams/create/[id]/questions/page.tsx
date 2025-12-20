"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./QuestionCreate.module.css";
import { QuestionService } from "@/domain/admin/questions/service";
import Pagination from "@/component/pagination/Pagination";
import { Button } from "@/component/ui/button/Button";
import  {useParams} from "next/navigation";
import { Question, QuestionQuery } from "@/domain/admin/questions/type";
import { API_URL } from "@/lib/service";
import Search from "@/component/search/Search";

export default function ExamQuestionCreate() {

    const token = Cookies.get("token");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [filterQuestion, setFilterQuestion] = useState<Question[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<{ exam_id: number, question_id: number }[]>([]);
    const params = useParams();
    const examId = Number(params.id);

    const [searchKeyword, setSearchKeyword] = useState<string>("");;
    const [query, setQuery] = useState<QuestionQuery>({
        page: 1,
        available: "All",
        type_question: 0,
        keyword: "",
    });

    const handleChangePage = (page: number) => {
        setQuery(prev => ({
            ...prev,
            page,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await QuestionService.fetchQuestions(query);
                setQuestions(data.questions);
                setTotalPage(data.last_page);
            } catch (err) {
                console.error("Lỗi khi fetch question:", err);
            }
        };
        fetchData();
    }, [query]);

    //Lọc các câu hỏi đang hoạt động (optional)
    useEffect(() => {
        setFilterQuestion(questions?.filter((q) => q.available === true));
    }, [questions]);

    const handleFilter = async (source: string) => {
        try {
            const res = await fetch(`${API_URL}/questions/filter?source=${source}&page=${query.page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Lỗi khi fetch dữ liệu");

            const data = await res.json()

            // Giả sử bạn muốn cập nhật state
            setQuestions(data.data.questions);
            setTotalPage(data.totalPage);
        } catch (error) {
            console.error("handleFilter error:", error);
        }
    };

    const handleSelectQuestion = (questionId: number) => {

        setSelectedQuestions((prev) => {
            const exists = prev.some((x) => x.question_id === questionId);

            if (exists) {
                return prev.filter((x) => x.question_id !== questionId);
            }

            return [...prev, { exam_id: examId, question_id: questionId }];
        });
    };

    const handleReset = () => {
        window.location.reload();
    }

    const handleCretaeExamQuestion = async () => {
        try {
            const res = await fetch(`${API_URL}/exams/questions/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ selectedQuestions })
            })

        } catch (error) {
            console.error("error:", error);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tạo câu hỏi cho bài thi</h1>

            {/* loc */}
            <div className={styles.action}>
                {/* reset */}
                <div className={styles.button}><Button onClick={() => handleReset()}>Đặt lại</Button></div>

                {/* Thêm câu hỏi cho bài kiểm tra */}
                <div className={styles.button}><Button onClick={() => handleCretaeExamQuestion()}>Hoàn thành</Button></div>

            </div>

            <div className={styles.filterType}>
                <div>
                    <select
                        onChange={(e) => {
                            setQuery(prev => ({
                                ...prev,
                                page: 1,
                                type_question: Number(e.target.value),
                            }));
                        }}
                        className={styles.select}
                    >
                        <option value="0">Tất cả loại câu hỏi</option>
                        <option value="1">1 đáp án</option>
                        <option value="2">Nhiều đáp án</option>
                        <option value="3">Tự luận</option>
                    </select>
                </div>
            </div>

            <div className={styles.search}>
                <Search setSearchKeyword={setSearchKeyword} typeSearch={"question"} />
            </div>

            {/* Bảng danh sách câu hỏi */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Nội dung</th>
                        <th>Đáp án</th>
                        <th>Chọn câu hỏi</th>
                    </tr>
                </thead>
                <tbody>
                    {filterQuestion?.length > 0 ? (
                        filterQuestion.map((q, index) => (
                            <tr key={q.question_id}>
                                <td>{index + 1}</td>
                                <td>{q.question_content}</td>
                                <td>
                                    <ul className={styles.answers}>
                                        {q.answers.map((a) => (
                                            <li key={a.answer_id}>
                                                {a.answer_content}{" "}
                                                {a.is_correct && <strong>(✔)</strong>}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.some(item => item.question_id === q.question_id)}
                                        onChange={() => handleSelectQuestion(q.question_id)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className={styles.empty}>
                                Không có câu hỏi nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* phan trang */}
            <Pagination
                totalPages={totalPage}
                currentPage={query.page}
                setCurrentPage={handleChangePage}
            />
        </div>
    );
}
