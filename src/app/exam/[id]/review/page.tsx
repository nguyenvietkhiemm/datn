"use client"
import styles from "./Review.module.css"
import { useParams, useRouter, usePathname } from "next/navigation"
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
        try {
            const res = await ExamService.checkDoExam(exam_id);

            if (!res?.data?.check) {
                switch (res.data.reason) {
                    case "ALREADY_DONE":
                        alert("Bạn đã làm bài thi này rồi");
                        break;

                    case "EXPIRED":
                        alert("Đề thi đã hết hạn");
                        break;

                    case "DISABLED":
                        alert("Đề thi hiện đang bị khóa");
                        break;

                    case "EXAM_NOT_FOUND":
                        alert("Không tìm thấy đề thi");
                        break;

                    default:
                        alert("Bạn không thể vào làm đề này");
                }
                return;
            }

            router.push(`/exam/${exam_id}/do`);
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại");
        }
    };

    return (
        <div className={styles.result_container}>

            {/* BUTTON BẮT ĐẦU THI */}
            <div className={styles.btn_do}>
                <Button onClick={() => handleDoExam(exam_id)}>
                    Bắt đầu thi
                </Button>
            </div>
            {/* TAB CONTENT */}
            <div className={styles.tab_content}>
                {children}
            </div>
        </div>
    );
}
