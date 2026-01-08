"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./question.module.css";
import Pagination from "@/component/pagination/Pagination";
import Search from "@/component/search/Search";
import { Button } from "@/component/ui/button/Button";
import FileList from "@/component/popup/FileList";
import type { Answer, Question, QuestionQuery } from "@/domain/admin/questions/type";
import type { FileInfo } from "@/domain/admin/file/type";
import { QuestionService } from "@/domain/admin/questions/service";
import QuestionCard from "@/component/card/QuestionCard/QuestionCard";
import { QuestionModel } from "@/domain/admin/questions/model";
import { FileService } from "@/domain/admin/file/service";
import { useRouter } from "next/navigation";

export default function Question() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [isFileList, setIsFileList] = useState<boolean>(false);
    const [fileList, setFileList] = useState<FileInfo[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const [filterCondition, setFilterCondition] = useState<any>(null);
    const docxInputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState<QuestionQuery>({
        page: 1,
        available: "All",
        type_question: 0,
        keyword: "",
    });
    const router = useRouter();

    // Lấy danh sách câu hỏi
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await QuestionService.fetchQuestions(query);
                setQuestions(data.questions);
                setTotalPage(data.last_page);
            } catch (err) {
                console.error("Lỗi khi fetch question:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);


    // Xoá câu hỏi
    const handleDelete = async (questionId: number) => {
        try {
            await QuestionService.deleteQuestion(questionId);
            setQuestions((prev) => prev.filter((q) => q.question_id !== questionId));
        } catch (err) {
            console.error("Lỗi khi xoá câu hỏi:", err);
        }
    };

    // Chuyển trạng thái hiển thị câu hỏi
    const handleToggleAvailable = async (questionId: number, available: boolean) => {
        try {
            await QuestionService.toggleQuestionAvailable(questionId, available);
            setQuestions((prev) =>
                prev.map((q) =>
                    q.question_id === questionId ? { ...q, available } : q
                )
            );
        } catch (error) {
            console.error("Lỗi khi đổi trạng thái:", error);
        }
    };

    const handleFetchJson = async () => {
        try {
            const url = `${API_URL}/file/json`;
            console.log(url)
            const data = await FileService.fetchFileList(url);

            setFileList(data)
            setIsFileList(true)
        } catch (error) {
            console.error("Lỗi fetchjsonContent:", error);
            throw error;
        }
    };

    // Upload json từ máy
    const handleUploadjson = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];

            if (!file) throw new Error("No file");

            const url = `${API_URL}/file/json/save/${file.name}`;
            const result = await FileService.uploadFile(url, file);
        } catch (error) {
            console.error("Lỗi uploadFile:", error);
            throw error;
        }
    };

    // Upload DOCX từ máy
    const handleUploadDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];

            if (!file) return;

            const url = `${API_URL}/microservice/bert/process-docx/${file.name}`;
            await FileService.uploadFile(url, file);
        } catch (error) {
            console.error("Lỗi uploadFile:", error);
            throw error;
        }
    };

    const handleChangePage = (page: number) => {
        setQuery(prev => ({
            ...prev,
            page,
        }));
    };

    const handleChangeSearch = (searchKeyword: string) => {
        setQuery(prev => ({
            ...prev,
            page:1,
            keyword: searchKeyword
        }))
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>QUẢN LÝ CÂU HỎI</h1>
                <div className={styles.actions}>
                    <div className={styles.search}>
                        <Search searchKeyword={query.keyword}
                            setSearchKeyword={handleChangeSearch}
                            typeSearch={"question"}
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <div className={styles.actionBtn}>
                            <input
                                type="file"
                                accept=".docx"
                                ref={docxInputRef}
                                style={{ display: "none" }}
                                onChange={handleUploadDocx}
                            />
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => docxInputRef.current?.click()}
                            >
                                Thêm câu hỏi từ DOCX
                            </Button>
                        </div>

                        <div className={styles.actionBtn}>
                            <Button variant="primary" size="md" onClick={handleFetchJson}>
                                Danh sách JSON
                            </Button>
                        </div>

                        <div className={styles.actionBtn}>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => router.push(`/admin/questions/create`)}
                            >
                                + Thêm câu hỏi
                            </Button>
                        </div>
                    </div>

                </div>
                
                <div className={styles.filterType}>
                    <div>
                        <select
                            value={query.type_question}
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

                    <div>
                        <select
                            value={query.available}
                            onChange={(e) => {
                                setQuery(prev => ({
                                    ...prev,
                                    page: 1,
                                    available: String(e.target.value),
                                }));
                            }}
                            className={styles.select}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="true">Hoạt động</option>
                            <option value="false">Ngừng</option>
                        </select>
                    </div>
                </div>

            </div>

            {isFileList && (
                <div className={styles.overlay}>
                    <div className={styles.jsonModal}>
                        <div className={styles.jsonHeader}>
                            <h2>Danh sách json</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setIsFileList(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <FileList fileList={fileList} />

                    </div>
                </div>
            )}



            {/* Bảng danh sách câu hỏi */}
            <div className={styles.questionList}>
                {questions?.map((row, rowIndex) => (
                    <QuestionCard
                        key={rowIndex}
                        question={{
                            ...row,
                            images: row.images,
                            answers: row.answers.map(ans => ({
                                ...ans,
                                images: QuestionModel.normalizeImages(ans.images)
                            }))
                        }}
                        rowIndex={rowIndex}
                        handleDelete={handleDelete}
                        handleToggleAvailable={handleToggleAvailable}
                    />
                ))}
            </div>

            {/* Phân trang */}
            <Pagination
                totalPages={totalPage}
                currentPage={query.page}
                setCurrentPage={handleChangePage}
            />
        </div>
    );
}
