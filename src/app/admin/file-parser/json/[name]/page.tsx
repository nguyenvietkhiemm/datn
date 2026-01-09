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
import NotificationPopup from "@/component/notification/Notification";
import { typeNoti } from "@/lib/model";
import { FileParserModel } from "@/domain/admin/file/file-parser/model";

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
          
              const cleanedData = data.map((item: any) => ({
                ...item,
                question: {
                  ...item.question,
                  text: item.question.text,
                  latex:item.question.latex,
                },
                answers: item.answers.map((ans: any) => ({
                  ...ans,
                  text: ans.text,
                  latex: ans.latex,
                })),
              }));
          
              setJsonData(cleanedData);
            } catch (err) {
              console.error("Lỗi tải JSON:", err);
            } finally {
              setLoading(false);
            }
          };
        loadJson();
    }, [name, token]);

    const handleChange = (
        rowIndex: number,
        type_change: number,
        value: ChangeValue
    ) => {
        setJsonData(prev => {
            const updated = [...prev];

            switch (type_change) {
                case -5: {
                    // xoá câu hỏi
                    return updated.filter((_, index) => index !== rowIndex);
                }

                case -1: {
                    // thay đổi nội dung câu hỏi
                    updated[rowIndex] = {
                        ...updated[rowIndex],
                        question: {
                            ...updated[rowIndex].question,
                            text: value as string,
                        },
                    };
                    break;
                }

                case -2: {
                    // đổi type_question
                    updated[rowIndex] = {
                        ...updated[rowIndex],
                        question: {
                            ...updated[rowIndex].question,
                            type_question: value as number,
                        },
                    };
                    break;
                }

                case -3: {
                    // thêm câu trả lời
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
                    break;
                }

                case -4: {
                    // xoá câu trả lời
                    const removeIndex = value as number;
                    updated[rowIndex] = {
                        ...updated[rowIndex],
                        answers: updated[rowIndex].answers.filter(
                            (_, i) => i !== removeIndex
                        ),
                    };
                    break;
                }

                case -6: {
                    // thêm ảnh cho câu hỏi
                    const imagePath = value as string;
                    const currentImages = updated[rowIndex].question.images || [];

                    updated[rowIndex] = {
                        ...updated[rowIndex],
                        question: {
                            ...updated[rowIndex].question,
                            images: [...currentImages, imagePath],
                        },
                    };
                    break;
                }

                case -7: {
                    // xoá ảnh của câu trả lời
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
                    break;
                }

                case -8: {
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
                    break;
                }

                case -9: {
                    // sửa text đáp án
                    const { answerIndex, value_change } = value as {
                        answerIndex: number;
                        value_change: string;
                    };

                    updated[rowIndex] = {
                        ...updated[rowIndex],
                        answers: updated[rowIndex].answers.map((a, i) =>
                            i === answerIndex
                                ? { ...a, text: value_change }
                                : a
                        ),
                    };
                    break;
                }

                case -11: {
                    // (chưa dùng)
                    break;
                }

                default: {
                    // tạo câu trả lời đúng
                    const ansIndex = type_change - 1000;
                    const type = updated[rowIndex].question.type_question ?? 1;

                    updated[rowIndex] = {
                        ...updated[rowIndex],
                        answers: updated[rowIndex].answers.map((a, i) => {
                            if (type === 1) {
                                // single choice
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
                    break;
                }
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
            // Validate tất cả câu đã chọn
            const invalidIndexes = selectedIndexes.filter(index => {
                const row = jsonData[index];
                return !row || !row.answers.some(a => a.is_correct);
            });

            if (invalidIndexes.length > 0) {
                setNotify({
                    message: `Các câu ${invalidIndexes.map(i => i + 1).join(", ")} chưa có đáp án đúng`,
                    type: "warning",
                    confirm: false,
                });
                return;
            }

            // Import song song – an toàn
            const results = await Promise.allSettled(
                selectedIndexes.map(async index => {
                    const row = jsonData[index];
                    if (!row) {
                        throw new Error(`Missing question at index ${index}`);
                    }

                    const payload = await QuestionModel.buildPayload(row);
                    await QuestionService.createQuestionWithAnswers(payload);

                    return index; // success
                })
            );

            // Phân tích kết quả
            const successIndexes: number[] = [];
            const failedIndexes: number[] = [];

            results.forEach((result, i) => {
                const originalIndex = selectedIndexes[i];

                if (result.status === "fulfilled") {
                    successIndexes.push(originalIndex + 1); // +1 cho user
                } else {
                    failedIndexes.push(originalIndex + 1);
                    console.error(
                        `Import failed at question ${originalIndex + 1}:`,
                        result.reason
                    );
                }
            });

            // 4️⃣ Thông báo kết quả
            if (failedIndexes.length > 0) {
                setNotify({
                    message:
                        successIndexes.length > 0
                            ? `Đã import câu: ${successIndexes.join(
                                ", "
                            )}. Lỗi tại câu: ${failedIndexes.join(", ")}`
                            : `Import thất bại các câu: ${failedIndexes.join(", ")}`,
                    type: successIndexes.length > 0 ? "warning" : "error",
                    confirm: false,
                });
                return;
            }

            // Thành công hoàn toàn
            setNotify({
                message: "Đã lưu tất cả câu hỏi vào hệ thống!",
                type: "success",
                confirm: false,
            });

            setSelectedIndexes([]);
            router.push(`/admin/questions`);
        } catch (err) {
            console.error("Import error:", err);
            setNotify({
                message: "Có lỗi không xác định khi import câu hỏi",
                type: "error",
                confirm: false,
            });
        }
    };


    if (loading) return <p>Loading...</p>;

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
                    disabled={selectedIndexes.length === 0}>
                    Import câu hỏi
                    {selectedIndexes.length > 0 && (
                        <span className={styles.badge}>
                            {selectedIndexes.length}
                        </span>
                    )}
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
                                Import
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
