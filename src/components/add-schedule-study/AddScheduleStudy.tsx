"use client";

import { useEffect, useState } from "react"
import styles from "./AddScheduleStudy.module.css";
import { Button } from "../ui/button";
import Cookies from "js-cookie";

interface StudyScheduleForm {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    status?: "pending" | "in_progress" | "completed";
    target_question: number;
    subject_id?: number;
}

interface Subject {
    subject_id: number;
    subject_name: string;
}

interface Props {
    setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddScheduleStudy({ setIsAdd }: Props) {
    const [form, setForm] = useState<StudyScheduleForm>({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        status: "pending",
        target_question: 0,
        subject_id: undefined,
    });
    const API_ARL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const token = Cookies.get("token");
    const [subjects, setSubjects] = useState<Subject[]>([]);

    // lay mon hoc
    useEffect(() => {
        const fetchSubject = async () => {
            const res = await fetch(`${API_ARL}/subjects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            setSubjects(data.data)
        }
        fetchSubject();
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "target_question") {
            const numericOnly = value;

            if (numericOnly !== value.replace(/[^0-9]/g, "")) {
                setForm(prev => ({ ...prev, target_question: "" as any }));
                setError("Không được để là chữ")
                return;
            }

            if (numericOnly === "") {
                setForm(prev => ({ ...prev, target_question: "" as any }));
                setError("Số câu hỏi mục tiêu không được để trống.")
                return;
            }

            if (numericOnly === "") {
                setForm(prev => ({ ...prev, target_question: "" as any }));
                setError("Số câu hỏi mục tiêu không được để trống.")
                return;
            }

            const num = Number(numericOnly);

            if (num === 0) {
                setForm(prev => ({ ...prev, target_question: num }));
                setError("Số câu hỏi phải lớn hơn 0.");
                return;
            }

            if (num > 10000) {
                setForm(prev => ({ ...prev, target_question: num }));
                setError("Số câu hỏi không được vượt quá 10.000.");
                return;
            }

            setError("");
            setForm(prev => ({ ...prev, target_question: num }));
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${API_ARL}/schedule/study/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
        window.location.reload()
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <h2>Tạo lịch học mới</h2>
                <div className={styles.button} onClick={() => setIsAdd(false)}>X</div>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Tiêu đề
                    <input className={styles.input} name="title" value={form.title} onChange={handleChange} required />
                </label>
                <label className={styles.label}>
                    Mô tả
                    <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} />
                </label>
                <label className={styles.label}>
                    Thời gian bắt đầu
                    <input className={styles.input} type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} />
                </label>
                <label className={styles.label}>
                    Thời gian kết thúc
                    <input className={styles.input} type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} />
                </label>
                <label className={styles.label}>
                    Số câu hỏi mục tiêu
                    <input className={styles.input} name="target_question" value={form.target_question} onChange={handleChange} />
                    {error && <p className={styles.error}>{error}</p>}
                </label>
                <label className={styles.label}>
                    Môn học
                    <select
                        value={form.subject_id ?? ""}
                        onChange={
                            (e) => {
                                const value = Number(e.target.value);
                                setForm(prev => ({ ...prev, subject_id: isNaN(value) ? undefined : value }));
                            }
                        }
                        className={styles.select}
                        name="subject_id"
                    >
                        <option value="">-- Chọn môn học --</option>
                        {subjects.map((s) => (
                            <option key={s.subject_id} value={s.subject_id}>
                                {s.subject_name}
                            </option>
                        ))}
                    </select>
                </label>
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo lịch học"}
                </Button>
            </form>
        </div>
    );
}
