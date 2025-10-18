"use client";
import React, { useState, useEffect } from "react";
import styles from "./BankList.module.css";
import Filter from "../filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setBank } from "@/store/slices/bankSlice";

type BankProps = {
    bank_id: number;
    description: string;
    topic_title: string;
    topic_id? : number
};

export default function Bank() {
    const dispatch = useDispatch();
    const banks = useSelector((state: RootState) => state.bank.banks);
    const [filterBank, setFilterBank] = useState<BankProps[]>([])

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
        dispatch(
            setBank(mockData)
        )
    }, []);

    useEffect(() => {
        setFilterBank(banks)
    },[banks])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ngân hàng câu hỏi</h1>
            {/* Bộ lọc */}
            <Filter banks={banks} setFilterBank={setFilterBank}/>
            
            {/* Danh sách bank */}
            <div className={styles.grid}>
                {filterBank.map((bank) => (
                    <div key={bank.bank_id} className={styles.card}>
                        <h2 className={styles.topic}>{bank.topic_title}</h2>
                        <p className={styles.description}>{bank.description}</p>
                        <button className={styles.button}>Xem chi tiết</button>
                    </div>
                ))}

                {filterBank.length === 0 && (
                    <p className={styles.empty}>Không có ngân hàng nào cho chủ đề này.</p>
                )}
            </div>
        </div>
    );
}
