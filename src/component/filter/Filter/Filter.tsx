"use client";
// Dùng cho exam, document, bank
import React, { useState, useEffect } from "react";
import styles from "./Filter.module.css";
import Cookies from "js-cookie";
import { Button } from "@/component/ui/button/Button";
import { Topic, Subject } from "@/domain/admin/topic_subject/type";

interface FilterProps {
    value: {
      subject: number | "All";
      topic: number | "All";
      status: string;
    };
    // onChange: (v: any) => void;
    onApply: (v: any) => void;
  }  

function Filter(
    { value, onApply }
        : FilterProps) {

    const [topics, setTopics] = useState<Topic[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const selectedSubject = value.subject;
    const selectedTopic = value.topic;
    const selectedStatus = value.status;
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const Status = [
        { label: 'Tất cả', value: "All" },
        { label: "Hoạt động", value: "true" },
        { label: "Không hoạt động", value: "false" }
    ]

    // Lay data topic, subject
    useEffect(() => {
        const token = Cookies.get("token")
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
        const fetchTopic = async () => {
            const resTopic = await fetch(`${API_URL}/topics`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })

            const data = await resTopic.json();
            setTopics(data.data)
        }

        const fetchSubject = async () => {
            const resSubject = await fetch(`${API_URL}/subjects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await resSubject.json();
            setSubjects(data.data)
        }
        fetchTopic();
        fetchSubject()
    }, []);

    //Thay doi bo loc
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

    // // ham loc
    // const handleFilter = () => {
    //     let topicIds: number[] = [];

    //     if (selectedSubject === "All") {
    //         if (selectedTopic !== "All") {
    //             topicIds = [Number(selectedTopic)];
    //         } else {
    //             topicIds = topics.map((t) => t.topic_id);
    //         }
    //     } else {
    //         if (selectedTopic !== "All") {
    //             topicIds = [Number(selectedTopic)];
    //         } else {
    //             topicIds = topics
    //                 .filter((t) => t.subject_id === selectedSubject)
    //                 .map((t) => t.topic_id);
    //         }
    //     }
    //     onChange({
    //         subject: selectedSubject,
    //         topics: topicIds,
    //         status: selectedStatus
    //     });
    // };

    return (
        <div className={styles.filter_container}>
            <h2 onClick={() => setShowFilter(!showFilter)}
                className={styles.filter_header}>
                {showFilter ? "▲" : "▼"} Bộ lọc
            </h2>

            {/* Filter */}
            {showFilter &&
                <div className={styles.active_border}>
                    <FilterGroup title={"Môn học"}
                        options={[{ label: "Tất cả", value: "All" },
                        ...subjects?.map((s) => ({ label: s.subject_name, value: s.subject_id }))
                        ]}
                        selected={selectedSubject}
                        onSelect={(v) =>
                            onApply({
                                ...value,
                                subject: v,
                                topic: "All",
                            })
                        }
                    />
                    <FilterGroup
                        title="Chủ đề"
                        options={[
                            { label: "Tất cả", value: "All" },
                            ...topics
                                ?.filter((t) => selectedSubject === "All" || t.subject_id === selectedSubject)
                                .map((t) => ({ label: t.title, value: t.topic_id })),
                        ]}
                        selected={selectedTopic}
                        onSelect={(v) =>
                            onApply({
                                ...value,
                                topic: v,
                            })
                        }
                    />
                    <FilterGroup title="Trạng thái"
                        options={Status}
                        selected={selectedStatus}
                        onSelect={(v) =>
                            onApply({
                                ...value,
                                status: v,
                            })
                        }
                    />
                    {/* <Button variant="outline" onClick={handleFilter}>
                        Lọc kết quả
                    </Button> */}
                </div>}
        </div>
    );
}

export default React.memo(Filter);