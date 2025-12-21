"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./JsonDetailPage.module.css";
import { Button } from "@/component/ui/button/Button";
import { JsonAnswer, JsonQuestion, Change, Params, ChangeValue } from "@/domain/admin/file/file-parser/type";
import { FileParserService } from "@/domain/admin/file/file-parser/service";
import { FileParserModel } from "@/domain/admin/file/file-parser/model";
import QuestionCreate from "@/component/questionCreate/page";
import { QuestionService } from "@/domain/admin/questions/service";
import { QuestionModel } from "@/domain/admin/questions/model";

export default function JsonDetailPage() {
    const { name } = useParams<Params>();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(true);
    const [jsonData, setJsonData] = useState<JsonQuestion[]>([]);
    const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
    const [changes, setChanges] = useState<Change[]>([]);

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

    // Chỉnh sửa text
    const loadJsonDiff = (data: JsonQuestion[]) => {
        if (!changes) return data;

        changes.forEach(d => {
            if (d.col === -1) {
                data[d.row].question.text = d.value as string;
            }
            else if (d.col === -2) {
                data[d.row].question.type_question = d.value as number;
            }
            else {
                data[d.row].answers[d.col].text = d.value as string;
            }
        });

        return data;
    };

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
                //xoa anh cu cua cau hoi
                // const imageIndex = value as number;
                // const image = FileParserModel.extractQuestionImages(updated[rowIndex], images)
                // updated[rowIndex] = {
                //     ...updated[rowIndex],
                //     question: {
                //         ...updated[rowIndex].question,
                //         images: image.filter((__, i) => i !== imageIndex)
                //     }
                // }
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

        // setChanges(prev => {
        //     const updated = [...prev];
        //     const existing = updated.find(c => c.row === rowIndex && c.col === colIndex);
        //     if (existing) existing.value = value;
        //     else updated.push({ row: rowIndex, col: colIndex, value });
        //     localStorage.setItem(`json_diff_${name}`, JSON.stringify(updated));
        //     return updated;
        // });
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
            const check = row.answers.some((a) =>  a.is_correct === true)
            if(!check) alert("Vui long chon cau tra loi dung")
            await QuestionService.createQuestionWithAnswers(payload);

            alert("Đã lưu câu hỏi vào hệ thống!");
        } catch (err) {
            console.error("Submit question failed:", err);
            alert("Lỗi khi lưu câu hỏi");
        }
    };

    const handleSubmitAll = async () => {
        try {
            for (const row of jsonData) {
                await handleSubmitQuestionToBE(row);
            }
            alert("Đã import toàn bộ câu hỏi!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi import");
        }
    };


    if (loading) return <p>Đang tải...</p>;
    // console.log(
    //     jsonData.map((j, index) => ({
    //       cauHoiThu: index + 1,
    //       anhcauHoimoi: j.question?.newImages,
    //     }))
    //   );

    return (
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                <Button onClick={handleSave} variant="primary" size="md">
                    Lưu thay đổi JSON
                </Button>
                <Button onClick={handleReset} variant="primary" size="md">
                    Tạo lại JSON gốc
                </Button>
                <Button onClick={handleSubmitAll} variant="primary">
                    Import toàn bộ câu hỏi vào hệ thống
                </Button>
            </div>

            <div className={styles.questionList}>
                {jsonData.map((row, rowIndex) => (
                    <div key={rowIndex}>
                        <QuestionCreate
                            key={rowIndex}
                            question={{
                                question_content: row.question.text,
                                available: true,
                                source: row.question.label,
                                type_question: row.question.type_question,
                                //  Tách ảnh của question
                                images: row.question.images,
                                //  Tách ảnh của từng answer
                                answers: row.answers.map((a, i) => ({
                                    answer_id: i,
                                    answer_content: a.text,
                                    is_correct: a.is_correct,
                                    images:a.images,
                                })),
                            }}
                            rowIndex={rowIndex}
                            editCell={editCell}
                            setEditCell={setEditCell}
                            handleChange={handleChange}
                            isChanged={isChanged}
                        />

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSubmitQuestionToBE(row)}
                        >
                            Lưu câu hỏi này vào hệ thống
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
