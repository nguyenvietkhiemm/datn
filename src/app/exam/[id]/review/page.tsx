"use client"
import styles from "./Review.module.css"
import { useParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExamService } from "../../../../../domain/exam/service"
import NotificationPopup from "@/components/notification/Notification"
import { typeNoti } from "../../../../../lib/model"
import { useState } from "react"

export default function ReviewExam({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const exam_id = Number(params.id);
    const router = useRouter();
    const pathname = usePathname();
    const [notify, setNotify] = useState<typeNoti | null>(null);

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
                        setNotify({
                            message: "Bạn đã làm bài thi này rồi",
                            type: "warning",
                            confirm: false
                        });
                        break;

                    case "EXPIRED":
                        setNotify({
                            message: "Đề thi đã hết hạn",
                            type: "warning",
                            confirm: false
                        });
                        break;

                    case "DISABLED":
                        setNotify({
                            message: "Đề thi hiện đang bị khóa",
                            type: "error",
                            confirm: false
                        });
                        break;

                    case "EXAM_NOT_FOUND":
                        setNotify({
                            message: "Không tìm thấy đề thi",
                            type: "info",
                            confirm: false
                        });
                        break;

                    default:
                        setNotify({
                            message: "Bạn không thể vào làm đề này",
                            type: "error",
                            confirm: false
                        });
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
            {notify && (
                <NotificationPopup
                    message={notify.message}
                    type={notify.type}
                    confirm={notify.confirm}
                    onClose={() => setNotify(null)}
                />
            )}
        </div>
    );
}
