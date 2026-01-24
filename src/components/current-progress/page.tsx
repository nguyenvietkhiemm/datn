"use client";

import { useEffect, useState } from "react";
import styles from "./CurrentProgress.module.css";
import Cookies from "js-cookie";

interface Goal {
    user_goal_id: number;
    target_score: string;      // backend trả string
    max_score: string | null;  // có thể null
    deadline: string;
    subject_name: string;
}

type CurrentProp = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CurrentProgress({ isOpen, setIsOpen }: CurrentProp) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const [mounted, setMounted] = useState(false);

    const fetchGoals = async () => {
        try {
            const res = await fetch(`${API}/goal`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            const now = new Date();

            const validGoals = (data.data || []).filter((g: Goal) => {
                return new Date(g.deadline) > now;
            });

            setGoals(validGoals);
        } catch (err) {
            console.error("Lỗi lấy tiến độ", err);
        }
    };

    useEffect(() => {
        if (isOpen) fetchGoals();
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    // Tính % tiến độ
    const calcProgress = (goal: Goal) => {
        const target = Number(goal.target_score);
        const max = Number(goal.max_score ?? 0);

        if (!target || target <= 0) return 0;

        return Math.min(Math.round((max / target) * 100), 100);
    };

    if (goals.length === 0) {
        return <p className={styles.noData}>Chưa có tiến độ!</p>;
    }

    return (
        <>
            <div className={styles.header}>
                <h3 className={styles.title}>Tiến độ hiện tại</h3>
                <span className={styles.arrow} onClick={handleClose}>
                    &gt;
                </span>
            </div>

            {goals.map((goal) => {
                const progress = calcProgress(goal);
                const maxScore = Number(goal.max_score ?? 0);

                return (
                    <div key={goal.user_goal_id} className={styles.goalItem}>
                        <div className={styles.goalHeader}>
                            <span className={styles.subjectName}>
                                {goal.subject_name}
                            </span>

                            <span className={styles.percent}>
                                {maxScore}/{goal.target_score} ({progress}%)
                            </span>
                        </div>

                        <div className={styles.progressBox}>
                            <div
                                className={styles.bar}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
}
