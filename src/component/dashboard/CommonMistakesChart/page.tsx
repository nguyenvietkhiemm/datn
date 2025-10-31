export default function CommonMistakesChart() {
    const mistakes = [
      { type: "Ngữ pháp (Anh)", rate: "32%" },
      { type: "Hàm số (Toán)", rate: "27%" },
      { type: "Điện xoay chiều (Lý)", rate: "22%" },
    ];
  
    return (
      <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
        <h3>⚠️ Loại câu hỏi dễ sai nhất</h3>
        <ul style={{ marginTop: 10 }}>
          {mistakes.map((m, i) => (
            <li key={i}>
              {m.type} — Sai <b>{m.rate}</b> bài
            </li>
          ))}
        </ul>
      </div>
    );
  }
  