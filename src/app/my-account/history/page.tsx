"use client";

import { useState } from "react";
import styles from "./History.module.css";
import ExamHistory from "@/components/exam-history/page";
import BankHistory from "@/components/bank-history/page";
import ProfilePage from "@/components/profile/page";

type HistoryTab = "exam" | "bank";

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState<HistoryTab>("exam");

    return (
        <ProfilePage>
            <div className={styles.container}>
                <div className={styles.tabs}>
                    <button
                        type="button"
                        onClick={() => setActiveTab("exam")}
                        className={`${styles.tab} ${activeTab === "exam" ? styles.active : ""
                            }`}
                    >
                        Lịch sử làm cuộc thi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("bank")}
                        className={`${styles.tab} ${activeTab === "bank" ? styles.active : ""
                            }`}
                    >
                        Lịch sử luyện ngân hàng câu hỏi
                    </button>
                </div>
                <div className={styles.content}>
                    {activeTab === "exam" && <ExamHistory />}
                    {activeTab === "bank" && <BankHistory />}
                </div>
            </div>
        </ProfilePage>
    );
}
