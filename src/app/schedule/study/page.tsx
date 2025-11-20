"use client";

import { useEffect, useState } from "react";
import styles from "./ScheduleStudy.module.css";
import Cookies from "js-cookie";
import Pagination from "@/components/pagination/Pagination";
import { Button } from "@/components/ui/button";
import AddScheduleStudy from "@/components/add-schedule-study/AddScheduleStudy";
import Search from "@/components/search/Search";

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

interface SubjectProp {
    subject_id: number;
    subject_name: string;
}

interface StatusProp {
    name: string,
    value: string
}
export default function ScheduleStudy() {
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const [schedules, setSchedules] = useState<StudySchedule[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("pending");
    const status: StatusProp[] = [
        { name: "Đang chờ", value: "pending" },
        { name: "Đã hoàn thành", value: "done" },
        { name: "Bỏ lỡ", value: "miss" }
    ]

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

    const handleFilter = async (currentPage: number, newStatus : string) => {
        try {
            const res = await fetch(`${API_URL}/schedule/study/filter?page=${currentPage}&status=${newStatus}`, {
                method: "GET",
                headers: {
                    "Content-Type": "appication/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const scheduleStudy = await res.json();
            setSchedules(scheduleStudy.data.schedule);
            setTotalPages(scheduleStudy.data.totalPages);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    function formatVN(dateStr: string) {
        const [datePart, timePart] = dateStr.split("T");
        const time = timePart ? timePart.slice(0, 5) : "00:00";
        const [year, month, day] = datePart.split("-");
        return `${day}/${month}/${year} ${time}`;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Danh sách lịch học</h1>

            {/* them lich hoc va tim kiem*/}
            <div className={styles.add_search}>
                <div className={styles.btn_add}>
                    <Button onClick={() => setIsAdd(true)}>Tạo lịch học</Button>
                </div>
                <div className={styles.search}>
                    <Search setTotalPage={setTotalPages} currentPage={currentPage} />
                </div>
            </div>

            {/* loc */}
            <div className={styles.filter}>
                <div className={styles.filter_status}>
                    {status.map((st, index) => (
                        <div
                            key={index}
                            className={`${styles.filter_status_s} ${selectedStatus === st.value ? styles.active : ""
                                }`}
                            onClick={async () => {
                                const newStatus : string = st.value;
                                setSelectedStatus(newStatus); 

                                await handleFilter(currentPage, newStatus); // dùng giá trị mới để filter
                            }}

                        >
                            {st.name}
                        </div>

                    ))}
                </div>
                {/* <div className={styles.filter_subjects}>
                    {subjects.map((s) => (
                        <div
                            key={s.subject_id}
                            className={`${styles.filter_subject} ${selectedSubject === s.subject_id ? styles.active : ""
                                }`}
                            onClick={() =>
                                setSelectedSubject(prev => prev === s.subject_id ? null : s.subject_id)
                            }
                        >
                            {s.subject_name}
                        </div>

                    ))}
                </div> */}
                {/* <div className={styles.btn_filter}>
                    <Button>Lọc</Button>
                </div> */}
            </div>

            {isAdd && <div className={styles.overlay}>
                <div className={styles.csvModal}>
                    <div className={styles.csvHeader}>
                        <AddScheduleStudy setIsAdd={setIsAdd} />
                    </div>
                </div>
            </div>}
            <ul className={styles.list}>
                {schedules?.map((s) => (
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
