export default function PopularSubjectsChart() {
    const data = [
      { subject: "Toán", count: 340 },
      { subject: "Anh", count: 290 },
      { subject: "Lý", count: 220 },
      { subject: "Hóa", count: 180 },
      { subject: "Văn", count: 150 },
    ];
  
    return (
      <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
        <h3>📚 Môn học được thi nhiều nhất</h3>
        <ul style={{ marginTop: 10 }}>
          {data.map((d, i) => (
            <li key={i}>
              {d.subject}: <b>{d.count}</b> lượt thi
            </li>
          ))}
        </ul>
      </div>
    );
  }
  