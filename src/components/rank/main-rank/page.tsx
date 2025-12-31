import styles from "./MainRank.module.css"
import { Rank } from "../../../../domain/exam/type"
import { ExamModel } from "../../../../domain/exam/model"
import Image from "next/image"
import Pagination from "@/components/pagination/Pagination"

interface MainRankProp {
    ranking: Rank[];
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: any) => void;
}

export default function MainRank({ ranking, totalPages, currentPage, setCurrentPage }: MainRankProp) {
    console.log(ranking);

    return (
        <div className={styles.conatiner_rank}>
            {/* ===== TOP 3 ===== */}
            {ranking.length >= 1 && (
                <div className={styles.top3}>
                    {[ranking[1], ranking[0], ranking[2]]
                        .filter(Boolean)
                        .map((u, i) => {
                            const rank = i === 1 ? 1 : i === 0 ? 2 : 3;

                            return (
                                <div
                                    key={rank}
                                    className={`${styles.topCard} ${styles[`rank${rank}`]}`}
                                >
                                    <div className={styles.topHeader}>
                                        <Image src={`/bgTop${rank}.png`}
                                            alt={`Rank ${rank}`}
                                            width={50}
                                            height={50} />
                                    </div>

                                    {/* <img
                                    src={`/IconRank${rank}.svg`}
                                    className={styles.rankIcon}
                                    alt=""
                                /> */}
                                    <div className={styles.info_user_rank}>
                                        <div className={styles.avatarWrap}>
                                            <div className={styles.avatar}>
                                                <img src="/avatar.svg" alt="avatar" />
                                            </div>
                                        </div>
                                        <div className={styles.name}>{u.user_name && u.user_name}</div>
                                        <div className={styles.score}>
                                            Tổng {u.score} Điểm
                                        </div>
                                        <div className={styles.time}>
                                            {ExamModel.formatTime(u.time_test)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )
            }

            {/* ===== BẢNG XẾP HẠNG ===== */}
            <div className={styles.table}>
                <div className={`${styles.row} ${styles.header}`}>
                    <div>Hạng</div>
                    <div>Tài khoản</div>
                    <div>Điểm</div>
                    <div>Thời gian</div>
                </div>

                {ranking.map((u, i) => {
                    const rankClass =
                        i === 0
                            ? styles.rank1
                            : i === 1
                                ? styles.rank2
                                : i === 2
                                    ? styles.rank3
                                    : "";

                    return (
                        <div key={i} className={`${styles.row} ${rankClass}`}>
                            <div>{i + 1}</div>
                            <div>{u?.user_name ?? "Ẩn danh"}</div>
                            <div>{u?.score ?? 0}</div>
                            <div>
                                {u?.time_test
                                    ? ExamModel.formatTime(u.time_test)
                                    : "--:--"}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    )
}