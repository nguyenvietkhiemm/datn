"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./UserGoal.module.css";
import { Button } from "@/components/ui/button";
import ProfilePage from "@/components/profile/page";
import { getGoalStatusDetail, GoalStatus } from "../../../../domain/user-goal/model";
import { formatVNDateTime } from "../../../../lib/model";

interface Goal {
    user_goal_id: number;
    target_score: string;
    max_score: string | null;
    deadline: string;
    subject_name: string;
    status?: GoalStatus;
}

interface Subject {
    subject_id: number;
    subject_name: string;
}

const STATUS_LABEL: Record<GoalStatus, string> = {
    CON_HAN: "Còn hạn",
    SAP_HET_HAN: "Sắp hết hạn",
    HET_HAN: "Hết hạn",
};

export default function UserGoal() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [error, setError] = useState<string>("");

    const [form, setForm] = useState({
        target_score: "",
        deadline: "",
        subject_id: ""
    });

    const API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");

    /*  FORM  */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "target_score") {
            let numericOnly = value.replace(/[^0-9.]/g, "");

            if ((numericOnly.match(/\./g) || []).length > 1) {
                setError("Chỉ được phép nhập một dấu thập phân.");
                return;
            }

            const num = Number(numericOnly);

            if (numericOnly === "") {
                setError("Số điểm mục tiêu không được để trống.");
                setForm(prev => ({ ...prev, target_score: "" }));
                return;
            }

            if (isNaN(num)) {
                setError("Điểm phải là số.");
                return;
            }

            if (num > 10) {
                setError("Số điểm không được vượt quá 10.");
                return;
            }

            setError("");
            setForm(prev => ({ ...prev, target_score: numericOnly }));
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.target_score || !form.deadline || !form.subject_id) {
            setError("Vui lòng nhập đầy đủ!");
            return;
        }

        await fetch(`${API}/goal/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ form })
        });

        setForm({
            target_score: "",
            deadline: "",
            subject_id: ""
        });

        fetchGoals();
    };

    /*  FETCH  */

    const fetchGoals = async () => {
        const res = await fetch(`${API}/goal`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        setGoals(
            (data.data || []).map((g: Goal) => ({
                ...g,
                status: getGoalStatusDetail(g.deadline),
            }))
        );
    };

    const fetchSubjects = async () => {
        const res = await fetch(`${API}/subjects`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSubjects(data.data || []);
    };

    useEffect(() => {
        fetchGoals();
        fetchSubjects();

    }, []);


    const calcProgress = (goal: Goal) => {
        const target = Number(goal.target_score);
        const max = Number(goal.max_score ?? 0);

        if (!target || target <= 0) return 0;

        return Math.min(Math.round((max / target) * 100), 100);
    };

    /*  RENDER  */

    return (
        <ProfilePage>
            <div className={styles.goal_container}>

                {/* ===== FORM ===== */}
                <form onSubmit={handleCreate} className={styles.goal_form}>
                    <label className={styles.label}>
                        Điểm mục tiêu
                        <input
                            className={styles.input}
                            name="target_score"
                            type="text"
                            inputMode="decimal"
                            value={form.target_score}
                            onChange={handleChange}
                        />
                        {error && <p className={styles.error}>{error}</p>}
                    </label>

                    <label className={styles.label}>
                        Thời hạn
                        <input
                            className={styles.input}
                            name="deadline"
                            type="datetime-local"
                            value={form.deadline}
                            onChange={handleChange}
                        />
                    </label>

                    <label className={styles.label}>
                        Môn học
                        <select
                            className={styles.select}
                            name="subject_id"
                            value={form.subject_id}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn môn --</option>
                            {subjects.map(s => (
                                <option key={s.subject_id} value={s.subject_id}>
                                    {s.subject_name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className={styles.btn}>
                        <Button>Tạo mục tiêu</Button>
                    </div>
                </form>

                {/* ===== LIST ===== */}
                <div className={styles.list_goal}>
                    <h3 className={styles.list_title}>Danh sách mục tiêu</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>Mục tiêu</th>
                                <th>Thời hạn</th>
                                <th>Môn học</th>
                                <th>Tiến trình</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {goals.map(goal => {
                                const progress = calcProgress(goal);
                                const maxScore = Number(goal.max_score ?? 0);

                                return (
                                    <tr key={goal.user_goal_id}>
                                        <td>{goal.target_score}</td>
                                        <td>{formatVNDateTime(goal.deadline)}</td>
                                        <td>{goal.subject_name}</td>

                                        <td>
                                            <div className={styles.progressWrap}>
                                                <span className={styles.progressText}>
                                                    {maxScore}/{goal.target_score} ({progress}%)
                                                </span>
                                                <div className={styles.progressBox}>
                                                    <div
                                                        className={styles.bar}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles.status} ${goal.status === "HET_HAN"
                                                    ? styles.expired
                                                    : goal.status === "SAP_HET_HAN"
                                                        ? styles.warning
                                                        : styles.active
                                                    }`}
                                            >
                                                {goal.status ? STATUS_LABEL[goal.status] : "—"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </ProfilePage>
    );
}
