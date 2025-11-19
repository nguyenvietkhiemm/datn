"use client";

import { useEffect, useState } from "react";
import styles from "./ScheduleStudy.module.css";
import Cookies from "js-cookie";
import Pagination from "@/components/pagination/Pagination";
import { Button } from "@/components/ui/button";
import AddScheduleStudy from "@/components/add-schedule-study/AddScheduleStudy";
import { UseDebounce } from "@/util/debounce";

interface StudySchedule {
    study_schedule_id: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    status?: string;
    target_question: number;
    subject_id: number;
    subject_name: string
}

export default function ScheduleStudy() {
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const [schedules, setSchedules] = useState<StudySchedule[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isAdd, setIsAdd] = useState<boolean>(false)

    const fetchSchedules = async (currentPage: number) => {
        try {
            const res = await fetch(`${API_URL}/schedule/study?page=${currentPage}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const scheduleStudy = await res.json();
            setSchedules(scheduleStudy.data.schedule);
            setTotalPages(scheduleStudy.data.totalPages);
        } catch (err) {
            console.error("Lỗi khi lấy lịch học:", err);
        }
    };

    useEffect(() => {
        fetchSchedules(currentPage);
    }, [currentPage]);

    function formatVN(dateStr: string) {
        const [datePart, timePart] = dateStr.split("T");
        const time = timePart ? timePart.slice(0, 5) : "00:00";
        const [year, month, day] = datePart.split("-");
        return `${day}/${month}/${year} ${time}`;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Danh sách lịch học</h1>

            {/* them lich hoc */}
            <Button onClick={() => setIsAdd(true)}>Tạo lịch học</Button>

            {isAdd && <div className={styles.overlay}>
                <div className={styles.csvModal}>
                    <div className={styles.csvHeader}>
                        <AddScheduleStudy setIsAdd={setIsAdd} />
                    </div>
                </div>
            </div>}
            <ul className={styles.list}>
                {schedules.map((s) => (
                    <li key={s.study_schedule_id} className={styles.item}>
                        <div className={styles.header}>
                            <h3 className={styles.title}>{s.title}</h3>
                        </div>
                        <p className={styles.description}>{s.description}</p>
                        <p className={styles.subject_name}>{s.subject_name}</p>

                        <p className={styles.date}>
                            <span>📅 Bắt đầu: {formatVN(s.start_time)}</span>
                            <span>📅 Kết thúc: {formatVN(s.end_time)}</span>
                        </p>
                        <p className={styles.status}>Status: {s.status}</p>
                    </li>
                ))}
            </ul>

            {/* phan trang */}
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
    );
}
