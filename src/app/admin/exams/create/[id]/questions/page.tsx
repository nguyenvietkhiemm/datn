"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./QuestionCreate.module.css";
import { QuestionService } from "@/domain/admin/questions/service";
import Pagination from "@/component/pagination/Pagination";
import { Button } from "@/component/ui/button/Button";
import { useParams } from "next/navigation";
import { Question, QuestionQuery } from "@/domain/admin/questions/type";
import { API_URL } from "@/lib/service";
import Search from "@/component/search/Search";
import { ImagePreview } from "@/component/questionCreate/ImageReview/page";
import { answerLabel } from "@/lib/model";
import { useRouter } from "next/navigation";

export default function ExamQuestionCreate() {

    const token = Cookies.get("token");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [filterQuestion, setFilterQuestion] = useState<Question[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<{ exam_id: number, question_id: number }[]>([]);
    const params = useParams();
    const examId = Number(params.id);
    const router = useRouter();
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

    const handleChangeSearch = (searchKeyword: string) => {
        setQuery(prev => ({
            ...prev,
            keyword: searchKeyword
        }))
    }

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
        setSelectedQuestions([]);
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
            router.push(`/admin/exams`)
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

            <div className={styles.search}>
                <Search searchKeyword={query.keyword} setSearchKeyword={handleChangeSearch} typeSearch={"question"} />
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

            <div className={styles.questionList}>
                {questions?.map((question, index) => (
                    <div className={styles.question_card}>
                        <h2 className={styles.title}>{`Câu ${index + 1}`}</h2>
                        <div
                            className={styles.content}
                        >
                            <p>{question.question_content}</p>
                            <input
                                type="checkbox"
                                checked={selectedQuestions.some(item => item.question_id === question.question_id)}
                                onChange={() => handleSelectQuestion(question.question_id)}
                            />
                        </div>

                        {/* ================= QUESTION IMAGES ================= */}
                        {question?.images && question.images.length > 0 && (
                            <div className={styles.imageGroup}>
                                {question?.images?.map((src, index) => (
                                    <div key={index} className={styles.imageWrapper}>
                                        <ImagePreview filename={src} width={200} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ================= ANSWERS ================= */}
                        <div className={styles.answerList}>
                            {question.answers.map((ans, answerIdx) => (
                                <div
                                    key={ans.answer_id}
                                    className={styles.answerItem}
                                >
                                    <span className={styles.answerLabel}>
                                        {answerLabel(answerIdx)}.
                                    </span>

                                    <p className={styles.answerText}>
                                        {ans.answer_content}{""}
                                        {ans.is_correct && <strong>(✔)</strong>}
                                    </p>

                                    {/* ===== Answer Images ===== */}
                                    {ans?.images && ans.images?.length > 0 && (
                                        <div className={styles.imageGroupSmall}>
                                            {ans.images?.map((src, index) => (
                                                <div key={index} className={styles.imageWrapperSmall}>
                                                    <ImagePreview filename={src} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* phan trang */}
            <Pagination
                totalPages={totalPage}
                currentPage={query.page}
                setCurrentPage={handleChangePage}
            />
        </div>
    );
}
