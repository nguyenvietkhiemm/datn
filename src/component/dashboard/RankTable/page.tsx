export default function RankTable() {
    const ranks = [
        { name: "Nguyễn Văn A", score: 9.6 },
        { name: "Trần Thị B", score: 9.4 },
        { name: "Lê Văn C", score: 9.2 },
    ];

    return (
        <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
            <h3>🏆 Bảng xếp hạng</h3>
            <table style={{ width: "100%", marginTop: 10 }}>
                <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                        <th style={{ padding: 8 }}>#</th>
                        <th style={{ padding: 8 }}>Tên</th>
                        <th style={{ padding: 8 }}>Điểm</th>
                    </tr>
                </thead>
                <tbody>
                    {ranks.map((r, i) => (
                        <tr key={i}>
                            <td style={{ padding: 8 }}>{i + 1}</td>
                            <td style={{ padding: 8 }}>{r.name}</td>
                            <td style={{ padding: 8 }}>{r.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
