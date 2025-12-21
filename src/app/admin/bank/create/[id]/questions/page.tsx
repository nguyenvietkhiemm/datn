"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./BankQuestion.module.css";
import { QuestionService } from "@/domain/admin/questions/service";
import Pagination from "@/component/pagination/Pagination";
import { Button } from "@/component/ui/button/Button";
import { useParams } from "next/navigation";
import { Question, QuestionQuery } from "@/domain/admin/questions/type";
import { API_URL } from "@/lib/service";
import Search from "@/component/search/Search";
import { ImagePreview } from "@/component/questionCreate/ImageReview/page";
import { answerLabel } from "@/lib/model";

export default function BankQuestionCreate() {
    const token = Cookies.get("token");

    const [questions, setQuestions] = useState<Question[]>([]);
    const [totalPage, setTotalPage] = useState<number>(1);
    const params = useParams();
    const bankId = Number(params.id);

    const [selectedQuestions, setSelectedQuestions] = useState<{
        bank_id: number;
        question_id: number;
    }[]>([]);

    console.log(selectedQuestions);
    
    const [query, setQuery] = useState<QuestionQuery>({
        page: 1,
        available: "true",
        type_question: 0,
        keyword: "",
    });

    const handleChangePage = (page: number) => {
        setQuery((prev) => ({
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

    // ================= SELECT QUESTION =================
    const handleSelectQuestion = (questionId: number) => {
        setSelectedQuestions((prev) => {
            const exists = prev.some(
                (x) => x.question_id === questionId
            );

            if (exists) {
                return prev.filter(
                    (x) => x.question_id !== questionId
                );
            }

            return [
                ...prev,
                { bank_id: bankId, question_id: questionId },
            ];
        });
    };

    // ================= RESET =================
    const handleReset = () => {
        setSelectedQuestions([])
    };

    // ================= SUBMIT =================
    const handleCreateBankQuestion = async () => {
        if (selectedQuestions.length === 0) {
            alert("Vui lòng chọn ít nhất một câu hỏi!");
            return;
        }

        try {
            const res = await fetch(
                `${API_URL}/banks/questions/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ selectedQuestions }),
                }
            );

            if (!res.ok) {
                throw new Error("Không thể thêm câu hỏi vào ngân hàng");
            }

            alert("Thêm câu hỏi vào ngân hàng thành công!");
        } catch (error) {
            console.error("error:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    // ================= RENDER =================
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Thêm câu hỏi vào ngân hàng
            </h1>

            {/* ACTION */}
            <div className={styles.action}>
                <div className={styles.button}>
                    <Button onClick={handleReset}>
                        Đặt lại
                    </Button>
                </div>

                <div className={styles.button}>
                    <Button onClick={handleCreateBankQuestion}>
                        Hoàn thành
                    </Button>
                </div>
            </div>

            {/* SEARCH */}
            <div className={styles.search}>
                <Search
                    searchKeyword={query.keyword}
                    setSearchKeyword={handleChangeSearch}
                    typeSearch="question"
                />
            </div>

            {/* FILTER TYPE */}
            <div className={styles.filterType}>
                <select
                    className={styles.select}
                    onChange={(e) =>
                        setQuery((prev) => ({
                            ...prev,
                            page: 1,
                            type_question: Number(e.target.value),
                        }))
                    }
                >
                    <option value="0">
                        Tất cả loại câu hỏi
                    </option>
                    <option value="1">1 đáp án</option>
                    <option value="2">Nhiều đáp án</option>
                    <option value="3">Tự luận</option>
                </select>
            </div>

            {/* TABLE */}
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
                                        <ImagePreview filename={src} />
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

            {/* PAGINATION */}
            <Pagination
                totalPages={totalPage}
                currentPage={query.page}
                setCurrentPage={handleChangePage}
            />
        </div>
    );
}
