"use client"
import styles from "./ResultExam.module.css"
import { Button } from "@/components/ui/button"
import { ResultExams } from "../../../../../domain/exam/type"

export default function ResultExam({ score }: ResultExams) {
    return (
        <div className={styles.result}>
            <h3>Kết quả</h3>
            <p>
                Điểm của bạn: <b>{score ?? "-"}</b>
            </p>
            <Button onClick={() => window.location.reload()}>
                Làm lại
            </Button>
        </div>
    )
}