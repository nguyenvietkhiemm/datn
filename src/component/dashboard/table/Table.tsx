"use client";
import { useState } from "react";
import styles from "./Table.module.css";

export default function SubjectStatsTable() {
  const examStats: {
    [key: string]: {
      subject: string;
      submissions: number;
      average: number;
      completion: number;
      max: number;
      min: number;
    }[]
  } = {
    "Đợt 1": [
      { subject: "Toán", submissions: 340, average: 6.7, completion: 91, max: 9.2, min: 3.5 },
      { subject: "Vật lý", submissions: 295, average: 6.4, completion: 88, max: 9.0, min: 4.0 },
      { subject: "Hóa học", submissions: 310, average: 6.6, completion: 90, max: 9.1, min: 4.2 },
    ],
    "Đợt 2": [
      { subject: "Toán", submissions: 360, average: 6.9, completion: 93, max: 9.5, min: 4.1 },
      { subject: "Vật lý", submissions: 280, average: 6.5, completion: 89, max: 8.9, min: 3.8 },
      { subject: "Hóa học", submissions: 320, average: 6.8, completion: 91, max: 9.3, min: 4.4 },
    ],
    "Đợt 3": [
      { subject: "Toán", submissions: 400, average: 7.1, completion: 95, max: 9.6, min: 4.5 },
      { subject: "Vật lý", submissions: 330, average: 6.8, completion: 92, max: 9.2, min: 4.2 },
      { subject: "Hóa học", submissions: 310, average: 6.9, completion: 90, max: 9.1, min: 4.3 },
    ],
  };

  const [selectedExam, setSelectedExam] = useState("Đợt 3");

  const currentData = examStats[selectedExam];

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.header}>
        <h4>Thống kê điểm theo môn học</h4>
        <select
          className={styles.select}
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          {Object.keys(examStats).map((exam) => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Môn học</th>
            <th>Số bài đã nộp</th>
            <th>Điểm trung bình</th>
            <th>Tỷ lệ hoàn thành</th>
            <th>Điểm cao nhất</th>
            <th>Điểm thấp nhất</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => (
            <tr key={index}>
              <td>{row.subject}</td>
              <td>{row.submissions}</td>
              <td>{row.average}</td>
              <td>{row.completion}%</td>
              <td>{row.max}</td>
              <td>{row.min}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
