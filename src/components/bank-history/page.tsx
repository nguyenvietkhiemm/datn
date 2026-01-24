"use client";
import { useEffect, useState } from "react";
import styles from "./BankHistory.module.css";
import { BankService } from "../../../domain/bank/service";
import { useRouter } from "next/navigation";
import { formatVNDateTime } from "../../../lib/model";

export default function BankHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {

    async function load() {
      const result = await BankService.getBankHistory();

      if (result?.data?.history) {
        setHistory(result.data.history);
      }
    }
    load();
  }, []);

  const handleResult = (bank_id: number, history_bank_id : number) => {
    router.push(`/practice/${bank_id}/result/${history_bank_id}`)
  }

  return (
      <div className={styles.container}>

        {history.length === 0 && (
          <p className={styles.empty}>Bạn chưa làm bài thi nào.</p>
        )}

        <div className={styles.list}>
          {history?.map((item, index) => (
            <div key={index} className={styles.card} onClick={() => handleResult(item.bank_id, item.history_bank_id)} >
              <div className={styles.left}>
                <div className={styles.description}>{item.description}</div>
                <div className={styles.score}>
                  Điểm: <b>{item.score}</b>
                </div>
                <div className={styles.timeTest}>
                  Thời gian làm bài: {(item.time_test / 1000).toFixed(0)} giây
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.date}>
                  {formatVNDateTime(item.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
