"use client"
import styles from "./Review.module.css"
import Ranking from "@/components/rank/page"
import { useParams } from "next/navigation";

export default function ReviewExam() {
    const params = useParams();
    const exam_id = Number(params.id);

    return (
        <div className={styles.result}>
            <Ranking exam_id={exam_id} />
        </div>
    )
}