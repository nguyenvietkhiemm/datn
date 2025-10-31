export default function ScheduleSummary() {
    const schedules = [
      { name: "Thi thử Toán", date: "10/11/2025" },
      { name: "Thi thử Anh", date: "12/11/2025" },
      { name: "Thi thử Hóa", date: "15/11/2025" },
    ];
  
    return (
      <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
        <h3>🗓️ Lịch thi sắp diễn ra</h3>
        <ul style={{ marginTop: 10 }}>
          {schedules.map((s, i) => (
            <li key={i}>
              {s.name} — <b>{s.date}</b>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  