import styles from "./RightRank.module.css";
import { Rank, myRank } from "../../../../domain/exam/type";

interface RightRankProp {
    rank: Rank[];
    myRank: myRank | null;
}

export default function RightRank({
    rank,
    myRank,
}: RightRankProp) {
    if (!myRank || !rank.length) return null;

    return (
        <div className={styles.right_rank}>
            <div className={styles.info_box}>
                <h4 className={styles.title}>Quy tắc tính điểm</h4>

                <p className={styles.paragraph}>
                    Thứ hạng của học sinh trong bài thi được xác định dựa trên chỉ số{" "}
                    <b>Final score</b>, kết hợp giữa điểm số đạt được và thời gian hoàn thành
                    bài thi.
                </p>

                <p className={styles.formula}>
                    <b>Final score</b> = <b>Score × 1.000.000.000</b> − <b>Time test</b>
                </p>

                <ul className={styles.explain_list}>
                    <li>
                        <b>Score</b>: tổng điểm học sinh đạt được trong bài thi.
                    </li>
                    <li>
                        <b>Time test</b>: thời gian làm bài, tính bằng giây kể từ khi nhấn nút
                        <b> “Bắt đầu làm bài”</b>.
                    </li>
                    <li>
                        Hệ số <b>1.000.000.000</b> được sử dụng nhằm đảm bảo rằng <b>điểm số
                            luôn được ưu tiên hơn thời gian</b>.
                    </li>
                </ul>

                <p className={styles.sub_title}>Nguyên tắc xếp hạng:</p>

                <ul className={styles.rule_list}>
                    <li>
                        🏆 Học sinh có <b>Final score cao hơn</b> sẽ được xếp hạng cao hơn.
                    </li>
                    <li>
                        ⏱ Trường hợp học sinh có cùng điểm số, học sinh <b>hoàn thành bài thi
                            nhanh hơn</b> sẽ được xếp trên.
                    </li>
                </ul>

                <p className={styles.note}>
                    Lưu ý: Thứ hạng được cập nhật tự động sau mỗi lần học sinh nộp bài hợp
                    lệ.
                </p>
            </div>
        </div>
    );
}
