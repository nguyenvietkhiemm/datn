import styles from "./Dashboard.module.css"
import Card from "@/component/dashboard/card/Card";
import LineChartBox from "@/component/dashboard/line/LineChartBox";
import Table from "@/component/dashboard/table/Table";
import BarChartBox from "@/component/dashboard/bar/BarChartBox";
import PieChartBox from "@/component/dashboard/pie/PieChartBox";

// data bar
const labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN', 'CN2']; // nhãn trục Y
const dataDau = [6.4, 6.2, 7.0, 6.5, 6.7, 6.3, 7.1, 6.9];

const data = dataDau;

const dataForChart = {
  labels,
  datasets: [
    {
      label: 'Điểm',        // tên dataset
      data,                  // mảng dữ liệu
      backgroundColor: 'rgba(54, 162, 235, 0.6)', // màu bar
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }
  ]
};

//data line
const lineData = [
  { date: "Oct 8", value: 42 },
  { date: "Oct 9", value: 58 },
  { date: "Oct 10", value: 61 },
  { date: "Oct 11", value: 70 },
  { date: "Oct 12", value: 68 },
  { date: "Oct 13", value: 90 },
  { date: "Oct 14", value: 85 },
];

//data pie
const pieDataBySubject = {
  "Toán": [25, 40, 25, 10],
  "Vật lý": [18, 50, 22, 10],
  "Hóa học": [15, 45, 30, 10],
  "Tiếng Anh": [30, 35, 25, 10],
  "Ngữ văn": [22, 42, 26, 10],
};

const labelspie = ['Giỏi (≥8)', 'Khá (6.5–7.9)', 'Trung bình (5–6.4)', 'Yếu (<5)'];

const pieDataBySubject2 = {
  "Toán": 1800,
  "Vật lý": 1200,
  "Hóa học": 1000,
  "Tiếng Anh": 2500,
  "Ngữ văn": 1500,
};

//data table
type UserStats = {
  date: string;
  activeUsers: number;
  userRatio: number; // tỉ trọng user (0-1)
  avgSession: number; // trung bình thời gian 1 session (phút)
  medianSession: number; // trung vị thời gian 1 session (phút)
};

const userStats: UserStats[] =
  [
    { date: "1/11/2025", activeUsers: 500, userRatio: 0.25, avgSession: 35.2, medianSession: 30 },
    { date: "2/11/2025", activeUsers: 520, userRatio: 0.26, avgSession: 36.1, medianSession: 31 },
    { date: "3/11/2025", activeUsers: 480, userRatio: 0.24, avgSession: 34.5, medianSession: 29 },
  ]


// Nhãn hiển thị tên môn học
const labels2 = ["Toán", "Vật lý", "Hóa học", "Tiếng Anh", "Ngữ văn"];

export default function DashboardPage() {
  return (
    <div className={styles.dashboard_container}>
      {/* Thẻ thông tin tổng quan */}
      <div className={styles.overview}>
        <h1 className={styles.title}>Tổng quan</h1>
        <section className={styles.grid}>
          <Card
            title="Số học sinh tham gia"
            value="1,245"
            change="+12.3%"
            tooltip="Tổng số học sinh đã tham gia kỳ thi trong tháng này, so với tháng trước."
          />
          <Card
            title="Bài thi đã nộp"
            value="6,824"
            change="+8.7%"
            tooltip="Số lượng bài thi đã được nộp thành công, bao gồm cả thi thử và chính thức so với tháng trước."
          />
          <Card
            title="Điểm trung bình"
            value="6.72 / 10"
            change="+0.3"
            tooltip="Điểm trung bình của tất cả học sinh trong kỳ thi gần nhất, so với kỳ trước."
          />
          <Card
            title="Tỷ lệ hoàn thành"
            value="85%"
            change="-2.1%"
            tooltip="Tỷ lệ học sinh hoàn thành toàn bộ bài thi, so với kỳ trước."
          />
          <Card
            title="Môn phổ biến nhất"
            value="Toán"
            change="+210 lượt"
            tooltip="Môn học có số lượt tham gia nhiều nhất trong kỳ thi này."
          />
          <Card
            title="Học sinh mới"
            value="154"
            change="+5.4%"
            tooltip="Số lượng học sinh mới đăng ký tham gia hệ thống trong tháng này, so vớI tháng trước."
          />
        </section>
      </div>

      {/* Biểu đồ */}
      <div className={styles.charts}>
        <div className={styles.time_graph}>
          <h1 className={styles.title}>Biểu đồ theo thời gian</h1>
          <div className={styles.line}>
            <LineChartBox data={lineData} />
          </div>
          <div className={styles.bar}>
            <BarChartBox title="Tỷ lệ học sinh theo mức điểm" datasets={dataForChart}/>
          </div>
        </div>

        <h1 className={styles.title}>Biểu đồ theo tỉ lệ</h1>
        <div className={styles.pie_chart}>
          <PieChartBox title="Tỷ lệ học sinh theo mức điểm" pieDataBySubject={pieDataBySubject} labels={labelspie} />
          <PieChartBox title="Môn được học sinh làm nhiều nhất" pieDataBySubject={pieDataBySubject2} labels={labels2} />
        </div>
      </div>

      {/* bảng thống kê */}
      <h1 className={styles.title}>Thống kê điểm theo môn học</h1>
      <Table userStats={userStats} />
    </div>
  );
}
