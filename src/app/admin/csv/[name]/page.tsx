"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

interface CsvRow {
    question: string;
    answer: string[];
}

export default function CsvDetailPage() {
    const { name } = useParams();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(true);
    const [csv, setCsv] = useState<CsvRow[]>([]);
    const [editCell, setEditCell] = useState<{ row: number, col: number } | null>(null)

    //lấy data csv
    useEffect(() => {
        const loadCsv = async () => {
            try {
                const saved = localStorage.getItem("csv");

                if (saved) {
                    const parsed: CsvRow[] = JSON.parse(saved);
                    setCsv(parsed);
                } else {
                    const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/csv/${name}`;
                    const res = await fetch(url, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const result = await res.json();

                    const cleaned: CsvRow[] = result.data.map((row: any) => {
                        const newRow: any = {};

                        // Xóa BOM khỏi key
                        Object.keys(row).forEach(key => {
                            const cleanKey = key.replace(/^\uFEFF/, '');
                            newRow[cleanKey] = row[key];
                        });

                        // Parse answer về mảng
                        if (typeof newRow.answer === "string") {
                            let parsed;
                            try {
                                // Thử parse trực tiếp (nếu backend đã gửi JSON chuẩn)
                                parsed = JSON.parse(newRow.answer);
                            } catch {
                                try {
                                    // Nếu lỗi, chuyển nháy đơn thành nháy kép rồi parse lại
                                    const normalized = newRow.answer
                                        .replace(/'/g, '"')
                                        .replace(/\\t/g, '\t');
                                    parsed = JSON.parse(normalized);
                                } catch {
                                    parsed = newRow.answer
                                        .replace(/^\[|\]$/g, '')
                                        .replace(/['"]+/g, '')
                                        .split(/\\t|, ?/);
                                }
                            }
                            newRow.answer = parsed;
                        }

                        return newRow;
                    });

                    setCsv(cleaned);
                }
            } catch (err) {
                console.error("Lỗi tải CSV:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCsv();
    }, [name, token]);

    //xác nhận ô nào đang sửa
    const handleEdit = async (rowIndex: number, colIndex: number) => {
        setEditCell({ row: rowIndex, col: colIndex })
    }

    //thay đổi giá trị
    const handleChange = async (rowIndex: number, colIdex: number, value: string) => {
        setCsv((prev) => {
            const updated = [...prev];
            if (colIdex === -1) {
                updated[rowIndex].question = value
            }
            else {
                updated[rowIndex].answer[colIdex] = value
            }

            localStorage.setItem("csv", JSON.stringify(updated))
            return updated
        })
    }

    const handleSave = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/csv/save/${name}`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(csv),
            });

            const result = await res.json();

            if (!res.ok) {
                alert(`Lỗi khi lưu: ${result.message || result.error}`);
                return;
            }

            alert(" Lưu CSV thành công!");
            localStorage.removeItem("csv");
            window.location.reload();
        } catch (err) {
            console.error("Lỗi khi lưu CSV:", err);
            alert(" Có lỗi xảy ra khi lưu CSV!");
        }
    };

    //hàm input
    function AutoResizeTextarea({
        value,
        onChange,
        autoFocus = false,
    }: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        autoFocus?: boolean;
    }) {
        const textareaRef = useRef<HTMLTextAreaElement | null>(null);

        // Cập nhật chiều cao mỗi khi value thay đổi
        useEffect(() => {
            const el = textareaRef.current;
            if (!el) return;
            el.style.height = "auto"; // reset trước
            el.style.height = `${el.scrollHeight}px`; // set theo nội dung
        }, [value]);

        return (
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
                onBlur={() => setEditCell(null)}
                style={{
                    width: "100%",
                    minHeight: "40px",
                    resize: "none",
                    boxSizing: "border-box",
                    border: "1px solid #0070f3",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    overflow: "hidden",
                    lineHeight: "1.5",
                    fontSize: "14px",
                }}
            />
        );
    }

    if (loading) return <p>Đang tải...</p>;

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Chỉnh sửa CSV #{name}</h1>
            <button
                onClick={handleSave}
                style={{
                    backgroundColor: "#0070f3",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "12px",
                }}
            >
                💾 Lưu CSV
            </button>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                    {csv.map((row, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid #ccc", padding: "4px 8px" }}
                                onClick={() => handleEdit(index, -1)}
                            >
                                {editCell?.row === index && editCell?.col === -1 ? (
                                    <AutoResizeTextarea
                                        value={row.question}
                                        onChange={(e) => handleChange(index, -1, e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    row.question
                                )}
                            </td>
                            {/* answer */}
                            {row.answer.map((a, j) => (
                                <td
                                    key={j}
                                    style={{ border: "1px solid #ccc", padding: "4px 8px", cursor: "pointer" }}
                                    onClick={() => handleEdit(index, j)}
                                >
                                    {editCell?.row === index && editCell?.col === j ? (
                                        <AutoResizeTextarea
                                            value={a}
                                            onChange={(e) => handleChange(index, j, e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        a
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
