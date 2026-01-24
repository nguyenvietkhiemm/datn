import styles from "./ResultSummary.module.css";
import { LatexPreview } from "../LatexPreview/page";

interface Props {
  correct: number;
  wrong: number;
  skip: number;
  score: number | null;
}

export default function ResultSummary({
  correct,
  wrong,
  skip,
  score
}: Props) {
  return (
    <div className={styles.summary}>
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.correct}`}>✔</div>
        <span className={styles.label}>Trả lời đúng</span>
        <b className={styles.value}>{correct}</b>
        <span className={styles.sub}>câu hỏi</span>
      </div>

      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.wrong}`}>✖</div>
        <span className={styles.label}>Trả lời sai</span>
        <b className={styles.value}>{wrong}</b>
        <span className={styles.sub}>câu hỏi</span>
      </div>

      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.skip}`}>—</div>
        <span className={styles.label}>Bỏ qua</span>
        <b className={styles.value}>{skip}</b>
        <span className={styles.sub}>câu hỏi</span>
      </div>

      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.score}`}>🏁</div>
        <span className={styles.label}>Điểm</span>
        <b className={styles.valueScore}>{score ?? "0.0"}</b>
      </div>
    </div>
  );
}
