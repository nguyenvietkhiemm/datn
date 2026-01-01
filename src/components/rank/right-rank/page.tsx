import styles from "./RightRank.module.css";

export default function RightRank() {
    return (
        <aside className={styles.right_rank}>
            <div className={styles.info_box}>
                <h4 className={styles.title}>Cách tính thứ hạng</h4>

                <p className={styles.text}>
                    Thứ hạng được xác định dựa trên chỉ số <b>Final score</b>, trong đó
                    <b> điểm số luôn được ưu tiên tuyệt đối</b>, thời gian chỉ dùng để
                    phân hạng khi các học sinh có cùng điểm.
                </p>

                <div className={styles.formula}>
                    <span>Final score</span>
                    <span>=</span>
                    <span>
                        ⌊Score × <b>1000</b>⌋ × <b>1.000.000</b> + (1.000.000 − Time)
                    </span>
                </div>

                <ul className={styles.list}>
                    <li>
                        <b>Score</b>: điểm bài thi (có thể là số thập phân).
                    </li>
                    <li>
                        <b>⌊Score × 1000⌋</b>: làm tròn xuống để tránh sai số số thực.
                    </li>
                    <li>
                        <b>Time</b>: thời gian làm bài (tính bằng giây).
                    </li>
                </ul>

                <div className={styles.divider} />

                <ul className={styles.rules}>
                    <li>🏆 Điểm cao hơn → xếp hạng cao hơn.</li>
                    <li>⏱ Cùng điểm → hoàn thành nhanh hơn xếp trên.</li>
                </ul>

                <p className={styles.note}>
                    Thứ hạng được tính và cập nhật tự động sau mỗi lần nộp bài hợp lệ.
                </p>
            </div>
        </aside>
    );
}
