"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./JsonDetailPage.module.css";
import QuestionCard from "@/component/card/QuestionCard/QuestionCard";
import { Button } from "@/component/ui/button/Button";
import { JsonAnswer, JsonQuestion, Change, Params } from "@/domain/admin/file/file-parser/type";
import { FileParserService } from "@/domain/admin/file/file-parser/service";
import { FileParserModel } from "@/domain/admin/file/file-parser/model";
import QuestionCreate from "@/component/questionCreate/page";
import { QuestionService } from "@/domain/admin/questions/service";

export default function JsonDetailPage() {
    const { name } = useParams<Params>();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(true);
    const [jsonData, setJsonData] = useState<JsonQuestion[]>([]);
    const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
    const [changes, setChanges] = useState<Change[]>([]);
    const [images, setImages] = useState<Record<string, string>>({});
    type ChangeValue =
    | string
    | number
    | boolean
    | null
    | File[]
    | {
          answerIndex: number;
          imageIndex: number;
      };

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

    // Tải ảnh sau khi JSON đã được tải xong
    useEffect(() => {
        // console.log("JSON Data changed, loading images...", jsonData);
        if (jsonData.length === 0) return;

        const loadImages = async () => {
            try {
                const mappedImages = await FileParserService.loadImages(jsonData, token);
                setImages(mappedImages);
            } catch (err) {
                console.error("Lỗi tải ảnh:", err);
            }
        };

        loadImages();
    }, [jsonData]);

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

    const handleChange = (rowIndex: number, colIndex: number, value: ChangeValue) => {
        setJsonData(prev => {
            const updated = [...prev];

            if (colIndex === -5) {
                return updated.filter((_, index) => index !== rowIndex);
            }

            if (colIndex === -1) {
                //thay doi noi dung
                updated[rowIndex].question.text = value as string;
            }
            else if (colIndex === -2) {
                //doi type_question
                updated[rowIndex].question.type_question = value as number;
            }
            else if (colIndex === -3) {
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
            else if (colIndex === -4) {
                //xoa cau tra loi
                const removeIndex = value as number;
                updated[rowIndex] = {
                    ...updated[rowIndex],
                    answers: updated[rowIndex].answers.filter(
                        (_, i) => i !== removeIndex
                    ),
                };
            }
            else if (colIndex === -6) {
                //them anh
                const files = value as File[];
            
                updated[rowIndex] = {
                    ...updated[rowIndex],
                    question: {
                        ...updated[rowIndex].question,
                        newImages: files, 
                    },
                };
            }
            else if (colIndex === -7) {
                //xoa anh cua cau tra loi
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
            else if (colIndex >= 1000) {
                //tao cau tra loi dung
                const ansIndex = colIndex - 1000;
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

            // sửa text đáp án
            else {
                updated[rowIndex].answers[colIndex].text = value as string;
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
            /* ===== 1. Ảnh cũ ===== */
            const oldImages = FileParserModel.extractQuestionImages(row, images);
            
            /* ===== 2. Ảnh mới ===== */
            let newImageLinks: string[] = [];
            if (row.question.newImages && row.question.newImages.length > 0) { 
                newImageLinks = await QuestionService.uploadQuestionImages(
                    row.question.newImages
                );
            }
            console.log("tiep tuc")
            /* ===== 3. Gộp ảnh ===== */
            const finalImages = [...oldImages, ...newImageLinks];
    
            /* ===== 4. Payload ===== */
            const payload = {
                question_content: row.question.text,
                available: true,
                source: row.question.label ?? "json",
                type_question: row.question.type_question,
                images: finalImages,
                answers: row.answers.map(a => ({
                    answer_content: a.text,
                    is_correct: a.is_correct,
                    images: FileParserModel.extractAnswerImages(a, images) || undefined,
                })),
            };
    
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
                                images: FileParserModel.extractQuestionImages(row, images),
                                newImages : row.question.newImages,
                                //  Tách ảnh của từng answer
                                answers: row.answers.map((a, i) => ({
                                    answer_id: i,
                                    answer_content: a.text,
                                    is_correct: a.is_correct,
                                    images: FileParserModel.extractAnswerImages(a, images),
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
