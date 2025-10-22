"use client";

import styles from "./Schedule.module.css";

export default function Schedule() {
  const schedules = [
    {
      id: 1,
      title: "Luyện đề TOEIC tháng 10",
      startTime: "2025-10-05 08:00",
      endTime: "2025-10-05 10:00",
      status: "Hoàn thành",
    },
    {
      id: 2,
      title: "Thi thử chuyên đề Reading",
      startTime: "2025-10-07 09:00",
      endTime: "2025-10-07 09:45",
      status: "Đang chờ",
    },
    {
      id: 3,
      title: "Kiểm tra Listening Part 2",
      startTime: "2025-10-08 13:30",
      endTime: "2025-10-08 14:15",
      status: "Đã hủy",
    },
    {
      id: 4,
      title: "Bài thi tổng hợp tháng 11",
      startTime: "2025-11-01 08:00",
      endTime: "2025-11-01 09:30",
      status: "Sắp tới",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Study & Exam Schedules</h1>
      <p className={styles.description}>
        Quản lý và theo dõi tất cả lịch học và lịch thi.
      </p>

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.primary}`}>
          + Thêm lịch mới
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.startTime}</td>
              <td>{item.endTime}</td>
              <td>
                <span
                  className={`${styles.status} ${item.status === "Hoàn thành"
                      ? styles.done
                      : item.status === "Đang chờ"
                        ? styles.pending
                        : item.status === "Đã hủy"
                          ? styles.cancel
                          : styles.upcoming
                    }`}
                >
                  {item.status}
                </span>
              </td>
              <td>
                <button className={`${styles.btn} ${styles.small}`}>Sửa</button>
                <button className={`${styles.btn} ${styles.danger}`}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
