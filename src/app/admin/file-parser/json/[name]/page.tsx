"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./JsonDetailPage.module.css";
import QuestionCard from "@/component/card/QuestionCard/QuestionCard";
import { Button } from "@/component/ui/button/Button";
import { JsonAnswer, JsonQuestion } from "@/domain/admin/file-parser/type";

function extractQuestionImages(question: JsonQuestion, imagesMap: Record<string, string>) {
    const list: string[] = [];

    question.question.media?.forEach(img => {
        const filename = img.saved_path.split(/[/\\]/).pop();
        if (filename && imagesMap[filename]) {
            list.push(imagesMap[filename]);
        }
    });

    return list;
}

function extractAnswerImages(answer: JsonAnswer, imagesMap: Record<string, string>) {
    const list: string[] = [];

    answer.media?.forEach(img => {
        const filename = img.saved_path.split(/[/\\]/).pop();
        if (filename && imagesMap[filename]) {
            list.push(imagesMap[filename]);
        }
    });

    return list;
}


type Change = {
    row: number;
    col: number;
    value: string;
};

function collectImageNames(jsonData: (JsonQuestion | JsonAnswer)[]): string[] {
    const files = new Set<string>();

    jsonData.forEach(item => {
        // Nếu là JsonQuestion
        if ("question" in item && "answers" in item) {
            item.question.media?.forEach(img => {
                const filename = img.saved_path.split(/[/\\]/).pop(); // lấy tên file
                if (filename) files.add(filename);
            });

            item.answers.forEach(a => {
                a.media?.forEach(img => {
                    const filename = img.saved_path.split(/[/\\]/).pop();
                    if (filename) files.add(filename);
                });
            });
        }

        // Nếu là JsonAnswer
        else if ("media" in item) {
            item.media?.forEach(img => {
                const filename = img.saved_path.split(/[/\\]/).pop();
                if (filename) files.add(filename);
            });
        }

    });

    return Array.from(files);
}


export default function JsonDetailPage() {
    const { name } = useParams();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(true);
    const [jsonData, setJsonData] = useState<JsonQuestion[]>([]);
    const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
    const [changes, setChanges] = useState<Change[]>([]);
    const [images, setImages] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!name) return;
        try {
            const saved = localStorage.getItem(`json_diff_${name}`);
            setChanges(saved ? JSON.parse(saved) : []);
        } catch {
            setChanges([]);
        }
    }, [name]);

    useEffect(() => {
        const loadJson = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/file/json/${name}`;
                const res = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = await res.json();
                const data: JsonQuestion[] = result.data || [];

                setJsonData(loadJsonDiff(data));

            } catch (err) {
                console.error("Lỗi tải JSON:", err);
            } finally {
                setLoading(false);
            }
        };

        loadJson();

    }, [name, token]);

    // Load images sau khi JSON đã sẵn sàng
    // Hàm này sẽ hơi lạ vì dùng POST để lấy ảnh
    useEffect(() => {
        if (jsonData.length === 0) return;

        async function loadImages() {
            const filenames = collectImageNames(jsonData);

            if (filenames.length === 0) return;

            try {
                const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/file/images`;

                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ filesname: filenames }),
                });

                const result = await res.json();

                // result.data = { filename, mime, data }
                const mapped: Record<string, string> = {};

                result.data.forEach((file: any) => {
                    mapped[file.filename] = `data:${file.mime};base64,${file.data}`;
                });

                console.log("Tệp ảnh đã tải:", mapped);

                setImages(mapped);
            } catch (err) {
                console.error("Lỗi tải ảnh:", err);
            }
        }

        loadImages();

    }, [jsonData, token]);

    // chỉnh sửa text
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

    const isChanged = (rowIndex: number, colIndex: number) =>
        changes.some(c => c.row === rowIndex && c.col === colIndex);

    const handleReset = () => {
        localStorage.removeItem(`json_diff_${name}`);
        window.location.reload();
    };

    const handleSave = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/json/save/${name}`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(jsonData),
            });
            const result = await res.json();
            if (!res.ok) return alert(`Lỗi khi lưu: ${result.message || result.error}`);
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
                            images: extractQuestionImages(row, images),

                            // ⭐ Tách ảnh của từng answer
                            answers: row.answers.map((a, i) => ({
                                answer_id: i,
                                answer_content: a.text,
                                is_correct: false,
                                images: extractAnswerImages(a, images),
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
