"use client"
import styles from "./Review.module.css"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExamService } from "../../../../../domain/exam/service"

export default function ReviewExam({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const exam_id = Number(params.id);
    const router = useRouter();
    const pathname = usePathname();

    // xác định tab active từ URL
    const getActiveTab = () => {
        if (pathname.includes("/review/exam-history")) return "history";
        if (pathname.includes("/review/rank")) return "ranking";
        return "ranking";
    };

    const activeTab = getActiveTab();

    const handleDoExam = async (exam_id: number) => {
        const checkDoExam = await ExamService.checkDoExam(exam_id);
    if(checkDoExam.data.check === false){
      alert("Bạn đã làm bài rồi");
      return
    }
        router.push(`/exam/${exam_id}/do`);
    };

    return (
        <div className={styles.result_container}>

            {/* BUTTON BẮT ĐẦU THI */}
            <div className={styles.btn_do}>
                <Button onClick={() => handleDoExam(exam_id)}>
                    Bắt đầu thi
                </Button>
            </div>

            {/* TABS HEADER */}
            <div className={styles.tabs_header}>
                <Link
                    href={`/exam/${exam_id}/review/rank`}
                    className={`${styles.tab_btn} ${activeTab === "ranking" ? styles.active : ""}`}
                >
                    Bảng xếp hạng
                </Link>
            </div>

            {/* TAB CONTENT */}
            <div className={styles.tab_content}>
                {children}
            </div>
        </div>
    );
}
