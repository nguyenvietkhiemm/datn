"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Schedule.module.css";
import { ScheduleService } from "@/domain/admin/schedules/service";
import FilterSchedule from "@/component/filter/FilterSchedules/FilterSchedules";
import { ExamSchedule } from "@/domain/admin/schedules/type";
import ScheduleExamView from "./detail/[id]/page";
import ExamScheduleCreate from "./create/page";
import Pagination from "@/component/pagination/Pagination";
import { formatVNDateTime } from "@/lib/model";
import { ScheduleModel } from "@/domain/admin/schedules/model";
import NotificationPopup from "@/component/notification/Notification";
import { useRouter } from "next/navigation";

type ViewMode = "LIST" | "DETAIL";
type ScheduleStatus = "UPCOMING" | "ONGOING" | "FINISHED";

export default function Schedule() {
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [filterSchedules, setFilterSchedules] = useState<ExamSchedule[]>([]);
  const [view, setView] = useState<ViewMode>("LIST");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEdit, setOpenEdit] = useState(false);
  const [editSchedule, setEditSchedule] = useState<ExamSchedule | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();

  /* STATUS LOGIC */

  const renderStatus = (status: ScheduleStatus) => {
    switch (status) {
      case "UPCOMING":
        return <span className={styles.statusUpcoming}>Sắp diễn ra</span>;
      case "ONGOING":
        return <span className={styles.statusOngoing}>Đang diễn ra</span>;
      case "FINISHED":
        return <span className={styles.statusFinished}>Đã kết thúc</span>;
    }
  };

  /* DATA */

  const loadSchedules = async () => {
    const data = await ScheduleService.fetchSchedules(currentPage);
    setExamSchedules(data.schedules || []);
    setFilterSchedules(data.schedules || []);
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => {
    loadSchedules();
  }, [currentPage]);

  /* VIEW HANDLERS */

  const openDetail = (id: number) => {
    router.push(`/admin/schedules/detail/${id}`)
  };

  const backToList = () => {
    setView("LIST");
    setSelectedId(null);
  };

  /* RENDER */

  return (
    <div className={styles.viewport}>
      <AnimatePresence mode="wait">
        {view === "LIST" && (
          <motion.div
            key="list"
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={styles.schedule_container}>
              <div className={styles.schedule_header}>
                <h1 className={styles.schedule_title}>QUẢN LÝ LỊCH THI</h1>

                <div className={styles.schedule_action}>
                  <button
                    className={styles.schedule_button}
                    onClick={() => setOpenCreate(true)}
                  >
                    + Thêm lịch thi
                  </button>

                  <div className={styles.filter_wrapper}>
                    <FilterSchedule
                      examSchedules={examSchedules}
                      setFilteredSchedules={setFilterSchedules}
                    />
                  </div>
                </div>
              </div>

              <table className={styles.schedule_table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Thời gian thi</th>
                    <th>Trạng thái</th>
                    <th>Tổng bài thi</th>
                    <th>Cập nhật</th>
                    <th>Sửa</th>
                    <th>Xoá</th>
                  </tr>
                </thead>

                <tbody>
                  {filterSchedules.map((item, index) => {
                    const status = ScheduleModel.getStatus(
                      item.start_time,
                      item.end_time
                    );

                    const isOngoing = status === "ONGOING";

                    return (
                      <tr key={item.exam_schedule_id}>
                        <td>{index + 1}</td>

                        <td
                          className={styles.timeCell}
                          onClick={() =>
                            openDetail(item.exam_schedule_id)
                          }
                        >
                          <div>{formatVNDateTime(item.start_time)}</div>
                          <div className={styles.timeArrow}> → </div>
                          <div>{formatVNDateTime(item.end_time)}</div>
                        </td>

                        <td>{renderStatus(status)}</td>

                        <td>{item.total_exams}</td>
                        <td>
                          {new Date(item.updated_at).toLocaleString('vi-VN', {
                            timeZone: 'Asia/Ho_Chi_Minh'
                          })}
                        </td>
                        <td>
                          <button
                            className={styles.editBtn}
                            disabled={isOngoing}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditSchedule(item);
                              setOpenEdit(true);
                            }}
                          >
                            Sửa
                          </button>
                        </td>
                        <td>
                          <button
                            className={styles.deleteBtn}
                            disabled={isOngoing}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(item.exam_schedule_id);
                            }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE */}
      <AnimatePresence>
        {openCreate && (
          <motion.div
            className={styles.backdrop}
            onClick={() => setOpenCreate(false)}
          >
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <ExamScheduleCreate
                onCancel={() => setOpenCreate(false)}
                onSuccess={() => {
                  loadSchedules();
                  setOpenCreate(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT */}
      <AnimatePresence>
        {openEdit && editSchedule && (
          <motion.div
            className={styles.backdrop}
            onClick={() => setOpenEdit(false)}
          >
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <ExamScheduleCreate
                initialData={editSchedule}
                onCancel={() => setOpenEdit(false)}
                onSuccess={() => {
                  loadSchedules();
                  setOpenEdit(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className={styles.backdrop}>
            <motion.div className={styles.confirmModal}>
              <h3>Bạn muốn xóa lịch thi này?</h3>
              <div className={styles.confirmActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => setDeleteId(null)}
                >
                  Hủy
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={async () => {
                    await ScheduleService.deleteSchedule(deleteId);
                    setDeleteId(null);
                    loadSchedules();
                  }}
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
