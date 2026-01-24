import styles from "./MyRank.module.css"
import Image from "next/image"
import { ExamModel } from "../../../../domain/exam/model"
import { myRank } from "../../../../domain/exam/type"

interface myRankProp {
    myRank: myRank
}

export default function MyRank({ myRank }: myRankProp) {
    
    return (
        <div className={styles.myRankBox}>
            <div className={styles.myRankTitle}>Thành tích của bạn</div>
            <div className={styles.myRankRow}>
                <span>Hạng</span>
                {/* {myRank.rank <= 3 ? (
                    <Image
                        src={`/IconRank${myRank.rank}.svg`}
                        alt={`Rank ${myRank.rank}`}
                        width={50}
                        height={50}
                    />
                ) : (
                    <div>{myRank.rank}</div>
                )} */}
                <div
                    className={
                        myRank.rank === 1
                            ? styles.rank1
                            : myRank.rank === 2
                                ? styles.rank2
                                : myRank.rank === 3
                                    ? styles.rank3
                                    : ""
                    }
                >
                    {myRank.rank}
                </div>

            </div>
            <div className={styles.myRankRow}>
                <span>Điểm</span>
                <b>{myRank.score}</b>
            </div>
            <div className={styles.myRankRow}>
                <span>Thời gian</span>
                <b>{ExamModel.formatTime(myRank.time_test)}</b>
            </div>
        </div>
    )
}