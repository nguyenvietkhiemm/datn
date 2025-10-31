"use client";
import styles from "./Dashboard.module.css"
import StatsCards from "@/component/dashboard/StatsCards/page";
import RankTable from "@/component/dashboard/RankTable/page";
import PopularSubjectsChart from "@/component/dashboard/PopularSubjectsChart/page";
import CommonMistakesChart from "@/component/dashboard/CommonMistakesChart/page";
import ScheduleSummary from "@/component/dashboard/ScheduleSummary/page";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📊 Dashboard Thi thử THPT</h1>

      {/* 1. Cards tổng quan */}
      <StatsCards />

      {/* 2. Biểu đồ môn học và lỗi thường gặp */}
      <div className={styles.charts}>
        <PopularSubjectsChart />
        <CommonMistakesChart />
      </div>

      {/* 3. Lịch thi và bảng xếp hạng */}
      <div className={styles.tables}>
        <ScheduleSummary />
        <RankTable />
      </div>
    </div>
  );
}
