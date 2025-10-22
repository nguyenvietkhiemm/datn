"use client";

import styles from "./Exam.module.css";

export default function Exam() {
  const exams = [
    { id: 1, name: "TOEIC Practice Test 01", duration: "45 phút", createdAt: "2025-10-01" },
    { id: 2, name: "TOEIC Practice Test 02", duration: "50 phút", createdAt: "2025-10-05" },
    { id: 3, name: "Reading Mock Exam", duration: "60 phút", createdAt: "2025-10-10" },
    { id: 4, name: "Listening Full Test", duration: "40 phút", createdAt: "2025-10-12" },
    { id: 5, name: "Vocabulary Challenge", duration: "30 phút", createdAt: "2025-10-15" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Exam Management</h1>
      <p className={styles.description}>Manage and review all available exams in the system.</p>

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.primary}`}>+ Add New Exam</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Exam Name</th>
            <th>Duration</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td>{exam.id}</td>
              <td>{exam.name}</td>
              <td>{exam.duration}</td>
              <td>{exam.createdAt}</td>
              <td>
                <button className={`${styles.btn} ${styles.small}`}>Edit</button>
                <button className={`${styles.btn} ${styles.danger}`}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
