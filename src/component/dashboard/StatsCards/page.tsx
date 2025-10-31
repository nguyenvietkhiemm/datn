import styles from "./StatsCars.module.css"

export default function StatsCards() {
  const stats = [
    { label: "Bài thi", value: "1,245" },
    { label: "Tài liệu", value: "320" },
    { label: "Đề ngân hàng", value: "540" },
    { label: "Lịch thi", value: "24" },
    { label: "Lượt thi", value: "4,830" },
  ];

  return (
    <div className={styles.cards}>
      {stats.map((s, i) => (
        <div key={i} className={styles.card}>
          <h3>{s.label}</h3>
          <p>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
