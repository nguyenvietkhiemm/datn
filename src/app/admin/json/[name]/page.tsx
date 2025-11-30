"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./CsvDetailPage.module.css";
import AutoResizeTextarea from "@/component/csv/autoresize/AutoResizeTextarea";
import { Button } from "@/component/ui/button/Button";

interface JsonAnswer {
    para_index: number;
    text: string;
    math: any[];
    images: any[];
    label: string;
}

interface JsonQuestion {
    question: {
        para_index: number;
        text: string;
        math: any[];
        images: any[];
        label: string;
    };
    answers: JsonAnswer[];
}

type Change = {
    row: number;
    col: number;
    value: string;
};

export default function CsvDetailPage() {
    const { name } = useParams();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(true);
    const [jsonData, setJsonData] = useState<JsonQuestion[]>([]);
    const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
    const [changes, setChanges] = useState<Change[]>([]);

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

    const loadJsonDiff = (data: JsonQuestion[]) => {
        if (!changes) return data;
        changes.forEach(d => {
            if (d.col === -1) data[d.row].question.text = d.value;
            else data[d.row].answers[d.col].text = d.value;
        });
        return data;
    };

    const handleEdit = (rowIndex: number, colIndex: number) => setEditCell({ row: rowIndex, col: colIndex });

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
        <div className={styles.csv_container}>
            <h1 className={styles.title}>Chỉnh sửa JSON #{name}</h1>

            <div className={styles.button}>
                <Button onClick={handleSave} variant="primary" size="md">💾 Lưu thay đổi JSON</Button>
                <Button onClick={handleReset} variant="primary" size="md">🔄 Tạo lại JSON gốc</Button>
            </div>

            <table className={styles.table}>
                <tbody>
                    {jsonData.map((row, rowIndex) => (
                        <tr key={rowIndex} className={styles.tr}>
                            <td
                                className={`${styles.cell} ${isChanged(rowIndex, -1) ? styles.changed : ""}`}
                                onClick={() => handleEdit(rowIndex, -1)}
                            >
                                {editCell?.row === rowIndex && editCell?.col === -1 ? (
                                    <AutoResizeTextarea
                                        value={row.question.text}
                                        onChange={e => handleChange(rowIndex, -1, e.target.value)}
                                        autoFocus
                                        setEditCell={setEditCell}
                                    />
                                ) : (
                                    row.question.text
                                )}
                            </td>

                            {row.answers.map((a, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`${styles.cell} ${isChanged(rowIndex, colIndex) ? styles.changed : ""}`}
                                    onClick={() => handleEdit(rowIndex, colIndex)}
                                >
                                    {editCell?.row === rowIndex && editCell?.col === colIndex ? (
                                        <AutoResizeTextarea
                                            value={a.text}
                                            onChange={e => handleChange(rowIndex, colIndex, e.target.value)}
                                            autoFocus
                                            setEditCell={setEditCell}
                                        />
                                    ) : (
                                        a.text
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
