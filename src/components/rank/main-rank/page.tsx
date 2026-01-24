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
                                    className={`${styles.topCard} ${styles[`topRank${rank}`]}`}
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
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.colRank}>Hạng</th>
                        <th>Tài khoản</th>
                        <th className={styles.colCenter}>Điểm</th>
                        <th className={styles.colCenter}>Thời gian</th>
                    </tr>
                </thead>

                <tbody>
                    {ranking.map((u, i) => {
                        const rankClass =
                            i === 0
                                ? styles.tableRank1
                                : i === 1
                                    ? styles.tableRank2
                                    : i === 2
                                        ? styles.tableRank3
                                        : "";

                        return (
                            <tr key={i} className={rankClass}>
                                <td className={styles.colRank}>{i + 1}</td>
                                <td>{u?.user_name ?? "Ẩn danh"}</td>
                                <td className={styles.colCenter}>{u?.score ?? 0}</td>
                                <td className={styles.colCenter}>
                                    {u?.time_test
                                        ? ExamModel.formatTime(u.time_test)
                                        : "--:--"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    )
}