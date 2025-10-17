"use client";

import { useState, useEffect } from "react";
import styles from "./Filter.module.css";
import { Button } from "../ui/button";

interface Topic {
    topic_id: number;
    title: string;
    description?: string;
    subject_id?: number | null;
    created_at: string;
}

interface Subject {
    subject_id: number;
    name: string;
}

type Exam = {
    exam_id: number;
    exam_name: string;
    created_at: string;
    time_limit: number;
    topic_id: number;
};

type BankProps = {
    bank_id: number;
    description: string;
    topic_title: string;
};

interface Document {
    document_id: number;
    title: string;
    link?: string;
    created_at: string;
    topic_id?: number | null;
}

interface FilterProps {
    exams?: Exam[];
    banks?: BankProps[];
    documents?: Document[];
    setExams?: React.Dispatch<React.SetStateAction<Exam[]>>
    setBanks?: React.Dispatch<React.SetStateAction<BankProps[]>>
    setDocuments?: React.Dispatch<React.SetStateAction<Document[]>>
}

export default function Filter(
    { exams = [], setExams, banks = [], setBanks, documents = [], setDocuments }
    : FilterProps)
    {

    const [topics, setTopics] = useState<Topic[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<number | "All">("All");
    const [selectedTopic, setSelectedTopic] = useState<number | "All">("All");

    // Mock data
    useEffect(() => {
        const mockTopics: Topic[] = [
            { topic_id: 1, title: "Hàm số và đồ thị", subject_id: 1, description: "Ôn tập các dạng bài về hàm số", created_at: "2025-10-01T09:00:00Z" },
            { topic_id: 2, title: "Hình học không gian", subject_id: 1, description: "Các bài toán về thể tích, góc, khoảng cách trong không gian", created_at: "2025-09-28T15:20:00Z" },
            { topic_id: 3, title: "Dao động cơ học", subject_id: 2, description: "Lý thuyết dao động điều hòa", created_at: "2025-09-20T08:30:00Z" },
            { topic_id: 4, title: "Điện xoay chiều", subject_id: 2, description: "Công thức, mạch điện RLC", created_at: "2025-09-10T10:00:00Z" },
            { topic_id: 5, title: "Phản ứng oxi hóa - khử", subject_id: 3, description: "Cân bằng phản ứng", created_at: "2025-08-25T08:45:00Z" },
            { topic_id: 6, title: "Este - Lipit", subject_id: 3, description: "Phản ứng este và lipid", created_at: "2025-08-12T13:20:00Z" },
            { topic_id: 7, title: "Thì trong tiếng Anh", subject_id: 4, description: "Tổng hợp 12 thì cơ bản", created_at: "2025-07-30T09:10:00Z" },
            { topic_id: 8, title: "Mệnh đề quan hệ", subject_id: 4, description: "Lý thuyết relative clauses", created_at: "2025-07-15T11:00:00Z" },
            { topic_id: 9, title: "Nghị luận xã hội", subject_id: 5, description: "Cách viết đoạn văn nghị luận", created_at: "2025-07-05T16:45:00Z" },
            { topic_id: 10, title: "Đọc hiểu văn bản", subject_id: 5, description: "Kỹ năng đọc hiểu trong đề thi", created_at: "2025-06-28T14:00:00Z" },
        ];
        const mockSubjects: Subject[] = [
            { subject_id: 1, name: "Toán học" },
            { subject_id: 2, name: "Vật lý" },
            { subject_id: 3, name: "Hóa học" },
            { subject_id: 4, name: "Tiếng Anh" },
            { subject_id: 5, name: "Ngữ văn" },
        ];

        setTopics(mockTopics);
        setSubjects(mockSubjects);
    }, []);

    const FilterGroup = ({
        title,
        options,
        selected,
        onSelect,
    }
        : {
            title: string,
            options: { label: string, value: any }[],
            selected: any;
            onSelect: (v: any) => void;
        }) => (
        <div className={styles.filter_group}>
            <p>{title}</p>
            <div className={styles.button_container}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        className={selected === opt.value ? styles.selected : ""}
                        onClick={() => onSelect(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    )

    const handleFilter = () => {
        setExams?.(prev =>
            selectedTopic === "All"
                ? prev
                : prev.filter(p => p.topic_id === selectedTopic))
    }

    return (
        <div className={styles.filter_container}>
            <h2>Bộ lọc</h2>
            {/* Filter */}
            <FilterGroup title={"Môn học"}
                options={[{ label: "Tất cả", value: "All" },
                ...subjects.map((s) => ({ label: s.name, value: s.subject_id }))
                ]}
                selected={selectedSubject}
                onSelect={(v) => {
                    setSelectedSubject(v);
                    setSelectedTopic("All");
                }}
            />

            <FilterGroup
                title="Chủ đề"
                options={[
                    { label: "Tất cả", value: "All" },
                    ...topics
                        .filter((t) => selectedSubject === "All" || t.subject_id === selectedSubject)
                        .map((t) => ({ label: t.title, value: t.topic_id })),
                ]}
                selected={selectedTopic}
                onSelect={(v) => setSelectedTopic(v)}
            />

            {/* nut loc */}
            <Button variant="outline" onClick={handleFilter}>
                Lọc kết quả
            </Button>
        </div>
    );
}
