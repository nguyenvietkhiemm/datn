"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./question.module.css";
import Pagination from "@/component/pagination/Pagination";
import Search from "@/component/search/Search";
import { Button } from "@/component/ui/button/Button";
import FileList from "@/component/popup/FileList";
import type { Answer, Question } from "@/domain/admin/questions/type";
import type { FileInfo } from "@/domain/admin/file/type";
import { QuestionService } from "@/domain/admin/questions/service";
import QuestionCard from "@/component/card/QuestionCard/QuestionCard";
import { QuestionModel } from "@/domain/admin/questions/model";
import { Change } from "@/domain/admin/file/file-parser/type";
import { FileService } from "@/domain/admin/file/service";

export default function Question() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filterQuestion, setFilterQuestion] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [isFileList, setIsFileList] = useState<boolean>(false);
    const [fileList, setFileList] = useState<FileInfo[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const [filterCondition, setFilterCondition] = useState<any>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const csvInputRef = useRef<HTMLInputElement>(null);
    const docxInputRef = useRef<HTMLInputElement>(null);
    const [changes, setChanges] = useState<Change[]>([]);
    const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);

    // Lấy danh sách câu hỏi
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await QuestionService.fetchQuestions(currentPage)
                setQuestions(data.questions);
                setTotalPage(data.last_page);
            } catch (err) {
                console.error("Lỗi khi fetch question:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    //Lọc các câu hỏi đang hoạt động (optional)
    useEffect(() => {
        setFilterQuestion(questions?.filter((q) => q.available === true));
    }, [questions]);

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
            console.log("FileService =", FileService);

            const data = await FileService.fetchFileList(url);

            setFileList(data)
            setIsFileList(true)
        } catch (error) {
            console.error("Lỗi fetchCsvContent:", error);
            throw error;
        }
    };

    // Upload Json từ máy
    // const handleUploadCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     try {
    //         const file = e.target.files?.[0];

    //         if (!file) return;

    //         const url = `${API_URL}/file/csv/save/${file.name}`;
    //         const result = await FileService.uploadFile(url, file);
    //     } catch (error) {
    //         console.error("Lỗi uploadFile:", error);
    //         throw error;
    //     }
    // };

    // Upload DOCX từ máy
    const handleUploadDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];

            if (!file) return;

            const url = `${API_URL}/file/docx/save/${file.name}`;
            const result = await FileService.uploadFile(url, file);
        } catch (error) {
            console.error("Lỗi uploadFile:", error);
            throw error;
        }
    };

    //change
    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        setQuestions(prev => {
            const updated = [...prev];
            if (colIndex === -1) updated[rowIndex].question_content = value;
            else updated[rowIndex].answers[colIndex].answer_content = value;
            return updated;
        });

        setChanges(prev => {
            const updated = [...prev];
            const existing = updated.find(c => c.row === rowIndex && c.col === colIndex);
            if (existing) existing.value = value;
            else updated.push({ row: rowIndex, col: colIndex, value });
            localStorage.setItem(`json_diff_${name}`, JSON.stringify(updated));
            return updated;
        });
    };

    const isChanged = (rowIndex: number, colIndex: number) => changes.some(c => c.row === rowIndex && c.col === colIndex)
    //  Loading
    if (loading)
        return <p className={styles.loading}>Đang tải danh sách câu hỏi...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý câu hỏi</h1>
                <div className={styles.actions}>
                    <Search setSearchKeyword={setSearchKeyword} />

                    <div className={styles.csv}>
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
                            onClick={() => docxInputRef.current?.click()}>
                            Thêm câu hỏi từ DOCX
                        </Button>
                    </div>

                    <div className={styles.csv}>
                        {/* <input
                            type="file"
                            accept=".csv"
                            ref={csvInputRef}
                            style={{ display: "none" }}
                            onChange={hande}
                        />

                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => csvInputRef.current?.click()}>
                            Thêm câu hỏi từ CSV
                        </Button> */}

                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleFetchJson}
                        >
                            Danh sách JSON
                        </Button>
                    </div>

                </div>
            </div>



            {isFileList && (
                <div className={styles.overlay}>
                    <div className={styles.csvModal}>
                        <div className={styles.csvHeader}>
                            <h2>Danh sách CSV</h2>
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
                        key={row.question_id}
                        question={{
                            ...row,
                            images: QuestionModel.normalizeImages(row.images),
                            answers: row.answers.map(ans => ({
                                ...ans,
                                images: QuestionModel.normalizeImages(ans.images)
                            }))
                        }}
                        rowIndex={rowIndex}
                        editCell={editCell}
                        setEditCell={setEditCell}
                        handleChange={handleChange}
                        isChanged={isChanged}
                        handleDelete={handleDelete}
                        handleToggleAvailable={handleToggleAvailable}
                    />
                ))}
            </div>

            {/* Phân trang */}
            <Pagination
                totalPages={totalPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
