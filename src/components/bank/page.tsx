"use client";
import React, { useState, useEffect } from "react";
import styles from "./BankList.module.css";

type BankProps = {
    bank_id: number;
    description: string;
    topic_title: string;
};

export default function Bank() {
    const [banks, setBanks] = useState<BankProps[]>([]);
    const [topics, setTopics] = useState<string[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>("Tất cả");

    useEffect(() => {
        const mockData: BankProps[] = [
            { bank_id: 1, description: "Ngân hàng câu hỏi thì hiện tại đơn", topic_title: "IELTS Academic" },
            { bank_id: 2, description: "Ngân hàng câu hỏi thì quá khứ đơn", topic_title: "TOEIC" },
            { bank_id: 3, description: "Câu điều kiện loại 1", topic_title: "HSK 3" },
            { bank_id: 4, description: "So sánh hơn", topic_title: "HSK 6" },
            { bank_id: 5, description: "Ngân hàng Toán THPTQG", topic_title: "Toán THPTQG" },
            { bank_id: 6, description: "Ngân hàng Hóa học THPTQG", topic_title: "Hóa học THPTQG" },
            { bank_id: 7, description: "Ngân hàng Sinh học", topic_title: "Sinh học THPTQG" },
            { bank_id: 8, description: "Ngân hàng Digital SAT", topic_title: "Digital SAT" },
            { bank_id: 9, description: "Ngân hàng Vật lý", topic_title: "Vật lý THPTQG" },
            { bank_id: 10, description: "Ngân hàng ACT", topic_title: "ACT" },
        ];
        setBanks(mockData);

        const topicList = Array.from(new Set(mockData.map((b) => b.topic_title)));
        setTopics(["Tất cả", ...topicList]);
    }, []);

    const filteredBanks =
        selectedTopic === "Tất cả"
            ? banks
            : banks.filter((b) => b.topic_title === selectedTopic);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ngân hàng câu hỏi</h1>

            {/* Bộ lọc topic dạng nút */}
            <div className={styles.topicFilter}>
                {topics.map((topic) => (
                    <button
                        key={topic}
                        className={`${styles.topicButton} ${selectedTopic === topic ? styles.active : ""
                            }`}
                        onClick={() => setSelectedTopic(topic)}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {/* Danh sách bank */}
            <div className={styles.grid}>
                {filteredBanks.map((bank) => (
                    <div key={bank.bank_id} className={styles.card}>
                        <h2 className={styles.topic}>{bank.topic_title}</h2>
                        <p className={styles.description}>{bank.description}</p>
                        <button className={styles.button}>Xem chi tiết</button>
                    </div>
                ))}

                {filteredBanks.length === 0 && (
                    <p className={styles.empty}>Không có ngân hàng nào cho chủ đề này.</p>
                )}
            </div>
        </div>
    );
}
