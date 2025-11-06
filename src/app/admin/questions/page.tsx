"use client";

import { useEffect, useState } from "react";
import styles from "./question.module.css";
import Cookies from "js-cookie";
import Pagination from "@/component/pagination/Pagination";
import Search from "@/component/search/Search";

interface Answer {
    answer_id: number;
    answer_content: string;
    is_correct: boolean;
}

interface Question {
    question_id: number;
    question_name: string;
    question_content: string;
    available: boolean;
    answers: Answer[];
}

export default function Question() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filterQuestion, setFilterQuestion] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [file, setFile] = useState<File | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

    // Lấy danh sách câu hỏi
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = Cookies.get("token");
                const res = await fetch(`${API_URL}/questions?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Không thể lấy danh sách câu hỏi");

                const data = await res.json();

                setQuestions(data.data.question);
                setTotalPage(data.data.totalPages);
            } catch (err) {
                console.error(" Lỗi khi fetch question:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [currentPage]);

    //Lọc các câu hỏi đang hoạt động (optional)
    useEffect(() => {
        setFilterQuestion(questions?.filter((q) => q.available === true));
    }, [questions]);

    //Upload file CSV
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        const token = Cookies.get("token");
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await fetch(`${API_URL}/questions/import`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload thất bại");

            const data = await res.json();
            setQuestions(data.data);
        } catch (error) {
            console.error(" Lỗi upload CSV:", error);
        }
    };

    // Xoá câu hỏi
    const handleDelete = async (questionId: number) => {
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_URL}/questions/remove/${questionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Xoá thất bại");

            setQuestions((prev) =>
                prev.filter((q) => q.question_id !== questionId)
            );
        } catch (err) {
            console.error("Lỗi xoá:", err);
        }
    };

    // Chuyển trạng thái hiển thị câu hỏi
    const handleToggleAvailable = async (questionId: number, available: boolean) => {
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_URL}/questions/setAvailable/${questionId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ available }),
            });

            if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

            setQuestions((prev) =>
                prev.map((q) =>
                    q.question_id === questionId ? { ...q, available } : q
                )
            );
        } catch (error) {
            console.error(" Lỗi khi đổi trạng thái:", error);
        }
    };

    //  Loading
    if (loading)
        return <p className={styles.loading}>Đang tải danh sách câu hỏi...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý câu hỏi</h1>
                <div className={styles.actions}>
                    <Search setFilterQuestion={setFilterQuestion} currentPage={currentPage} setTotalPage={setTotalPage}/>
                    {/* Upload CSV */}
                    <label className={styles.uploadBox}>
                        <input type="file" accept=".csv" onChange={handleUpload} />
                    </label>
                </div>
            </div>

            {/* Bảng danh sách câu hỏi */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Dạng câu hỏi</th>
                        <th>Nội dung</th>
                        <th>Đáp án</th>
                        <th>Trạng thái</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {filterQuestion?.length > 0 ? (
                        filterQuestion.map((q, index) => (
                            <tr key={q.question_id}>
                                <td>{index + 1}</td>
                                <td>{q.question_name}</td>
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
                                <td
                                    className={q.available ? styles.active : styles.inactive}
                                    onClick={() =>
                                        handleToggleAvailable(q.question_id, !q.available)
                                    }
                                >
                                    {q.available ? "Hoạt động" : "Ẩn"}
                                </td>
                                <td>
                                    <button
                                        className={styles.delBtn}
                                        onClick={() => handleDelete(q.question_id)}
                                    >
                                        X
                                    </button>
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

            {/* Phân trang */}
            <Pagination
                totalPages={totalPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
