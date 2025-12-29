"use client";

import React, { useState, useEffect } from "react";
import styles from "./Bank.module.css";
import Filter from "@/components/filter/Filter";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setBank } from "@/store/slices/bankSlice";
import { BankService } from "../../../domain/bank/service";
import { useRouter } from "next/navigation";
import { BankProps } from "../../../domain/bank/type";

export default function Bank() {
  const dispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCondition, setFilterCondition] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await BankService.fetchBank({
          page: currentPage,
          topics: filterCondition?.topics,
          search: searchKeyword,
          subject_id: filterCondition?.subject_id
        });

        dispatch(setBank(res.data.banks));
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBanks();
  }, [currentPage, filterCondition, searchKeyword]);

  const handleDoBank = async (bank_id: number, bank: BankProps) => {
    localStorage.setItem("bank", JSON.stringify(bank))
    router.push(`/practice/${bank_id}/do`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ngân hàng câu hỏi</h1>

      <div className={styles.filter_search}>
        <Filter
          setFilterCondition={setFilterCondition}
          setSearchKeyword={setSearchKeyword}
        />
        <Search
          setSearchKeyword={setSearchKeyword}
          setFilterCondition={setFilterCondition}
        />
      </div>

      <div className={styles.grid}>
        {banks.map((bank,index) => (
          <div key={index} className={styles.card}>
            {/* Tiêu đề */}
            <h3 className={styles.card_title}>
              Ngân hàng câu hỏi số {index + 1}
            </h3>

            {/* Mô tả */}
            <p className={styles.description}>
              {bank.description || "Ngân hàng câu hỏi phục vụ luyện tập và ôn tập."}
            </p>

            {/* Thông tin phụ */}
            <div className={styles.meta}>
              <span className={styles.label}>⏱ Thời gian:</span>
              <span className={styles.time}>
                {bank.time_limit ? `${bank.time_limit} phút` : "Không giới hạn"}
              </span>
            </div>

            {/* Action */}
            <button
              className={styles.button}
              onClick={() => handleDoBank(bank.bank_id, bank)}
            >
              Xem chi tiết
            </button>
          </div>
        ))}

        {banks.length === 0 && (
          <p className={styles.empty}>
            Không có ngân hàng nào cho chủ đề này.
          </p>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
