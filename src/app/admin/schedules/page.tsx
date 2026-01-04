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

type ViewMode = "LIST" | "DETAIL";

export default function Schedule() {
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [filterSchedules, setFilterSchedules] = useState<ExamSchedule[]>([]);
  const [view, setView] = useState<ViewMode>("LIST");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadSchedules = async () => {
    const data = await ScheduleService.fetchSchedules();

    setExamSchedules(data.schedules || []);
    setFilterSchedules(data.schedules || []);
    setTotalPages(data.totalPages || 1)
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const openDetail = (id: number) => {
    setSelectedId(id);
    setView("DETAIL");
  };

  const backToList = () => {
    setView("LIST");
    setSelectedId(null);
  };

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
                    <th>Bắt đầu</th>
                    <th>Kết thúc</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {filterSchedules.map((item, index) => (
                    <tr
                      key={item.exam_schedule_id}
                      onClick={() => openDetail(item.exam_schedule_id)}
                    >
                      <td>{index + 1}</td>
                      <td>{formatVNDateTime(item.start_time)}</td>
                      <td>{formatVNDateTime(item.end_time)}</td>
                      <td>{formatVNDateTime(item.created_at)}</td>
                      <td>{formatVNDateTime(item.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {view === "DETAIL" && selectedId && (
          <motion.div
            key="detail"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
          >
            <ScheduleExamView
              scheduleId={selectedId}
              onBack={backToList}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE MODAL INLINE */}
      <AnimatePresence>
        {openCreate && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenCreate(false)}
          >
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

    </div>
  );
}
