"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./JsonDetailPage.module.css";
import { Button } from "@/component/ui/button/Button";
import { JsonQuestion, Change, Params, ChangeValue } from "@/domain/admin/file/file-parser/type";
import { FileParserService } from "@/domain/admin/file/file-parser/service";
import QuestionCreate from "@/component/questionCreate/page";
import { QuestionService } from "@/domain/admin/questions/service";
import { QuestionModel } from "@/domain/admin/questions/model";
import { Upload } from "lucide-react";
import NotificationPopup from "@/component/notification/Notification";
import { typeNoti } from "@/lib/model";

export default function JsonDetailPage() {
    const { name } = useParams<Params>();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(true);
    const [jsonData, setJsonData] = useState<JsonQuestion[]>([]);
    const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
    const [changes, setChanges] = useState<Change[]>([]);
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const router = useRouter();
    const [notify, setNotify] = useState<typeNoti | null>(null);

    // Lấy các thay đổi đã lưu từ localStorage
    useEffect(() => {
        if (!name) return;

        const loadChanges = async () => {
            const storedChanges = await FileParserService.getStoredChanges(name);
            setChanges(storedChanges);
        };

        loadChanges();

        // Tải JSON
        const loadJson = async () => {
            if (!name || !token) return;

            try {
                const data = await FileParserService.loadJson(name, token);
                setJsonData(data);
            } catch (err) {
                console.error("Lỗi tải JSON:", err);
            } finally {
                setLoading(false);
            }
        };

        loadJson();
    }, [name, token]);

    const handleChange = (rowIndex: number, type_change: number, value: ChangeValue) => {
        setJsonData(prev => {
            const updated = [...prev];

            if (type_change === -5) {
                // xoa cau hoi
                return updated.filter((_, index) => index !== rowIndex);
            }

            if (type_change === -1) {
                //thay doi noi dung cau hoi
                updated[rowIndex].question.text = value as string;
            }
            else if (type_change === -2) {
                //doi type_question
                updated[rowIndex].question.type_question = value as number;
            }
            else if (type_change === -3) {
                //them cau tra loi
                updated[rowIndex] = {
                    ...updated[rowIndex],
                    answers: [
                        ...updated[rowIndex].answers,
                        {
                            text: "",
                            is_correct: false,
                        },
                    ],
                };
            }
            else if (type_change === -4) {
                //xoa cau tra loi
                const removeIndex = value as number;
                updated[rowIndex] = {
                    ...updated[rowIndex],
                    answers: updated[rowIndex].answers.filter(
                        (_, i) => i !== removeIndex
                    ),
                };
            }
            else if (type_change === -6) {
                //them anh cho cau hoi
                const imagePath = value as string;
                const currentImages = updated[rowIndex].question.images || [];

                updated[rowIndex] = {
                    ...updated[rowIndex],
                    question: {
                        ...updated[rowIndex].question,
                        images: [...currentImages, imagePath],
                    },
                };
            }
            else if (type_change === -7) {
                //xoa anh cua cu cau tra loi 
                const { answerIndex, imageIndex } = value as {
                    answerIndex: number;
                    imageIndex: number;
                };

                updated[rowIndex] = {
                    ...updated[rowIndex],
                    answers: updated[rowIndex].answers.map((a, i) =>
                        i === answerIndex
                            ? {
                                ...a,
                                images: a.images?.filter((_, idx) => idx !== imageIndex),
                            }
                            : a
                    ),
                };
            }
            else if (type_change === -8) {
                // thêm ảnh cho câu trả lời
                const { answerIndex, imagePath } = value as {
                    answerIndex: number;
                    imagePath: string;
                };

                updated[rowIndex] = {
                    ...updated[rowIndex],
                    answers: updated[rowIndex].answers.map((a, i) =>
                        i === answerIndex
                            ? {
                                ...a,
                                images: [...(a.images || []), imagePath],
                            }
                            : a
                    ),
                };
            }
            else if (type_change === - 9) {
                // sửa text đáp án
                const { answerIndex, value_change } = value as {
                    answerIndex: number;
                    value_change: string
                }

                updated[rowIndex].answers[answerIndex].text = value_change;
            }
            else if (type_change === -11) {
            }
            else {
                //tao cau tra loi dung
                const ansIndex = type_change - 1000;
                const type = updated[rowIndex].question.type_question ?? 1;

                updated[rowIndex] = {
                    ...updated[rowIndex],
                    answers: updated[rowIndex].answers.map((a, i) => {
                        if (type === 1) {
                            return {
                                ...a,
                                is_correct: i === ansIndex,
                            };
                        } else {
                            // multiple choice
                            return i === ansIndex
                                ? { ...a, is_correct: !a.is_correct }
                                : a;
                        }
                    }),
                };
            }

            return updated;
        });
    };

    const isChanged = (rowIndex: number, colIndex: number) => changes.some(c => c.row === rowIndex && c.col === colIndex)

    const handleReset = () => {
        localStorage.removeItem(`json_diff_${name}`);
        window.location.reload();
    };

    const handleSave = async () => {
        try {
            await FileParserService.saveJson(name, jsonData, token);
            alert("Lưu JSON thành công!");
            localStorage.removeItem(`json_diff_${name}`);
            window.location.reload();
        } catch (err) {
            console.error("Lỗi khi lưu JSON:", err);
            alert("Có lỗi xảy ra khi lưu JSON!");
        }
    };

    const handleSubmitQuestionToBE = async (row: JsonQuestion) => {
        try {
            const payload = await QuestionModel.buildPayload(row);
            const check = row.answers.some((a) => a.is_correct === true)
            if (!check) {
                setNotify({
                    message: "Vui long chon cau tra loi dung",
                    type: "warning",
                    confirm: false
                });
                return
            }
            await QuestionService.createQuestionWithAnswers(payload);
            setNotify({
                message: "Đã lưu câu hỏi vào hệ thống!",
                type: "success",
                confirm: false
            });
            router.push(`/admin/questions`)
        } catch (err) {
            console.error("Submit question failed:", err);
            setNotify({
                message: "Lỗi khi lưu câu hỏi",
                type: "error",
                confirm: false
            });
        }
    };

    const handleSubmitSelect = async () => {
        try {
            for (const index of selectedIndexes) {
                const row = jsonData[index];

                if (!row) continue;

                const hasCorrect = row.answers.some(
                    a => a.is_correct === true
                );

                if (!hasCorrect) {
                    setNotify({
                        message: "Vui lòng chọn câu trả lời đúng cho tất cả câu đã chọn",
                        type: "warning",
                        confirm: false
                    });
                    return;
                }
                const payload = await QuestionModel.buildPayload(row);
                await QuestionService.createQuestionWithAnswers(payload);
            }

            setNotify({
                message: "Đã lưu câu hỏi vào hệ thống!",
                type: "success",
                confirm: false
            });
            setSelectedIndexes([]);
            router.push(`/admin/questions`)
        } catch (err) {
            setNotify({
                message: "Lỗi khi lưu câu hỏi",
                type: "error",
                confirm: false
            });
        }
    };


    if (loading) return <p>Đang tải...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.actionBar}>
                <div className={styles.leftActions}>
                    <Button onClick={handleSave} variant="primary" size="md">
                        Lưu thay đổi JSON
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="md">
                        Tạo lại JSON gốc
                    </Button>
                </div>

                <Button
                    onClick={handleSubmitSelect}
                    variant="primary"
                    size="md"
                    className={styles.importBtn}
                >
                    Import {selectedIndexes.length} câu hỏi đã chọn
                </Button>

            </div>


            <div className={styles.questionList}>
                {jsonData.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.questionCard}>
                        <QuestionCreate
                            question={{
                                question_content: row.question.text,
                                available: true,
                                source: row.question.label,
                                type_question: row.question.type_question,
                                images: row.question.images,
                                answers: row.answers.map((a, i) => ({
                                    answer_id: i,
                                    answer_content: a.text,
                                    is_correct: a.is_correct,
                                    images: a.images,
                                })),
                            }}
                            rowIndex={rowIndex}
                            editCell={editCell}
                            setEditCell={setEditCell}
                            handleChange={handleChange}
                            isChanged={isChanged}
                            setSelectedIndexes={setSelectedIndexes}
                            selectedIndexes={selectedIndexes}
                        />

                        <div className={styles.cardActions}>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleSubmitQuestionToBE(row)}
                            >
                                Import câu hỏi này vào hệ thống
                            </Button>
                        </div>
                    </div>
                ))}

            </div>
            {notify && (
                <NotificationPopup
                    message={notify.message}
                    type={notify.type}
                    confirm={notify.confirm}
                    onClose={() => setNotify(null)}
                />
            )}
        </div>
    );
}
