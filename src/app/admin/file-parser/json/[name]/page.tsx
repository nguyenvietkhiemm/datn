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

export default function JsonDetailPage() {
    const { name } = useParams<Params>();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(true);
    const [jsonData, setJsonData] = useState<JsonQuestion[]>([]);
    const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
    const [changes, setChanges] = useState<Change[]>([]);
    const [images, setImages] = useState<Record<string, string>>({});

    // Lấy các thay đổi đã lưu từ localStorage
    useEffect(() => {
        if (!name) return;

        const loadChanges = async () => {
            const storedChanges = await FileParserService.getStoredChanges(name);
            setChanges(storedChanges);
        };

        loadChanges();
    }, [name]);

    // Tải JSON
    useEffect(() => {
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
        console.log("JSON Data changed, loading images...", jsonData);
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
    }, [jsonData, token]);

    // Chỉnh sửa text
    const loadJsonDiff = (data: JsonQuestion[]) => {
        if (!changes) return data;
        changes.forEach(d => {
            if (d.col === -1) data[d.row].question.text = d.value;
            else data[d.row].answers[d.col].text = d.value;
        });
        return data;
    };

    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        setJsonData(prev => {
            const updated = [...prev];
            if (colIndex === -1) updated[rowIndex].question.text = value;
            else updated[rowIndex].answers[colIndex].text = value;
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
    if (loading) return <p>Đang tải...</p>;


    return (
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                <Button onClick={handleSave} variant="primary" size="md">
                    💾 Lưu thay đổi JSON
                </Button>
                <Button onClick={handleReset} variant="primary" size="md">
                    🔄 Tạo lại JSON gốc
                </Button>
            </div>

            <div className={styles.questionList}>
                {jsonData.map((row, rowIndex) => (

                    // component QuestionCard nhé
                    <QuestionCard
                        key={rowIndex}
                        question={{
                            question_id: rowIndex,
                            question_name: `Câu ${rowIndex + 1}`,
                            question_content: row.question.text,
                            available: true,
                            source: row.question.label,

                            // ⭐ Tách ảnh của question
                            images: FileParserModel.extractQuestionImages(row, images),

                            // ⭐ Tách ảnh của từng answer
                            answers: row.answers.map((a, i) => ({
                                answer_id: i,
                                answer_content: a.text,
                                is_correct: false,
                                images: FileParserModel.extractAnswerImages(a, images),
                            })),
                        }}

                        rowIndex={rowIndex}
                        editCell={editCell}
                        setEditCell={setEditCell}
                        handleChange={handleChange}
                        isChanged={isChanged}
                    />
                ))}

            </div>
        </div>
    );
}
