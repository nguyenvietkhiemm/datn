import styles from "./Dashboard.module.css"
import Card from "@/component/dashboard/card/Card";
import LineChartBox from "@/component/dashboard/line/LineChartBox";
import Table from "@/component/dashboard/table/Table";
import BarChartBox from "@/component/dashboard/bar/BarChartBox";
import RadarChartBox from "@/component/dashboard/radar/RadarChartBox";
import PieChartBox from "@/component/dashboard/pie/PieChartBox";

const dataBar = {
  'Đợt 1': [6.4, 6.2, 7.0, 6.5, 6.7, 6.3, 7.1, 6.9],
  'Đợt 2': [6.8, 6.5, 7.2, 6.6, 6.9, 6.5, 7.4, 7.0],
  'Đợt 3': [3.1, 6.7, 7.5, 6.8, 7.0, 6.6, 7.6, 7.2],
};

const radarData = {
  labels: ['Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh'],
  datasets: [
    {
      label: 'Khối D',
      data: [7.2, 6.9, 8.3, 6.4, 6.5, 6.0],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    },
  ],
};

const lineData = {
  labels: ['Đợt 1', 'Đợt 2', 'Đợt 3', 'Đợt 4'],
  datasets: [
    {
      label: 'Điểm trung bình toàn khối',
      data: [6.4, 6.7, 6.9, 7.2],
      borderColor: '#2ecc71',
      backgroundColor: 'rgba(46, 204, 113, 0.2)',
      tension: 0.3,
    },
  ],
};


const pieDataBySubject = {
  "Toán": [25, 40, 25, 10],
  "Vật lý": [18, 50, 22, 10],
  "Hóa học": [15, 45, 30, 10],
  "Tiếng Anh": [30, 35, 25, 10],
  "Ngữ văn": [22, 42, 26, 10],
};

const labels = ['Giỏi (≥8)', 'Khá (6.5–7.9)', 'Trung bình (5–6.4)', 'Yếu (<5)'];

export default function DashboardPage() {
  return (
    <div className={styles.dashboard_container}>
      {/* Thẻ thông tin số lượng */}
      <section className={styles.grid}>
        <Card title="Số học sinh tham gia" value="1,245" change="+12.3%" />
        <Card title="Bài thi đã nộp" value="6,824" change="+8.7%" />
        <Card title="Điểm trung bình" value="6.72 / 10" change="+0.3" />
        <Card title="Tỷ lệ hoàn thành" value="85%" change="-2.1%" />
        <Card title="Môn phổ biến nhất" value="Toán" change="+210 lượt" />
        <Card title="Học sinh mới" value="154" change="+5.4%" />
      </section>
      
      {/* Biểu đồ */}
      <div className={styles.charts}>
        <div className={styles.chart_subject}>
          <LineChartBox title="Xu hướng điểm trung bình qua các đợt" data={lineData} />
          <BarChartBox title="Điểm trung bình theo môn" datasets={dataBar} />
        </div>
        {/* <RadarChartBox title="Năng lực tổng thể khối D" data={radarData} /> */}
        <div className={styles.pie_chart}>
          <PieChartBox title="Tỷ lệ học sinh theo mức điểm" pieDataBySubject={pieDataBySubject} labels={labels} />
          <PieChartBox title="Môn được học sinh làm nhiều nhất" pieDataBySubject={pieDataBySubject} labels={labels} />
        </div>
      </div>
      <Table />
    </div>
  );
}
