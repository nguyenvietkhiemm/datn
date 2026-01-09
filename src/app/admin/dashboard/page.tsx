"use client";

import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import Card from "@/component/dashboard/card/Card";
import LineChartBox from "@/component/dashboard/line/LineChartBox";
import BarChartBox from "@/component/dashboard/bar/BarChartBox";
import PieChartBox from "@/component/dashboard/pie/PieChartBox";
import Table from "@/component/dashboard/table/Table";

import DashBoardService from "@/domain/admin/dashboard/service";

import { DashboardResponse, LineItem, BarChartData, UserStats } from "@/domain/admin/dashboard/type";
import EmptyState from "@/component/empty/Empty";

export default function DashboardPage() {
  /* ---------- STATE ---------- */
  const [overview, setOverview] = useState<DashboardResponse | null>(null);
  const [lineData, setLineData] = useState<LineItem[]>([]);
  const [dauData, setDauData] = useState<BarChartData | null>(null);
  const [wauData, setWauData] = useState<BarChartData | null>(null);
  const [mauData, setMauData] = useState<BarChartData | null>(null);
  const [pieScore, setPieScore] = useState<any>(null);
  const [pieSubjectJoin, setPieSubjectJoin] = useState<any>(null);
  const [pieSubjectDone, setPieSubjectDone] = useState<any>(null);
  const [tableData, setTableData] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
          DashBoardService.getDashboardStatsCard(),
          DashBoardService.getDashboarStatsLine(),
          DashBoardService.getDashboardActiveUsers(),
          DashBoardService.getDashboardPie(),
          DashBoardService.getDashboardTable(),
        ]);

        const [
          cardRes,
          lineRes,
          activeRes,
          pieRes,
          tableRes,
        ] = results;

        if (cardRes.status === "fulfilled") {
          setOverview(cardRes.value.data);
        }

        if (lineRes.status === "fulfilled") {
          setLineData(lineRes.value.data.line ?? []);
        }

        if (activeRes.status === "fulfilled") {
          setDauData(activeRes.value.data?.dau ?? null);
          setWauData(activeRes.value.data?.wau ?? null);
          setMauData(activeRes.value.data?.mau ?? null);
        }

        if (pieRes.status === "fulfilled") {
          setPieScore(pieRes.value.data?.score ?? null);
          setPieSubjectJoin(pieRes.value.data?.subject_join ?? null);
          setPieSubjectDone(pieRes.value.data?.subject_done ?? null);
        }

        if (tableRes.status === "fulfilled") {
          setTableData(tableRes.value.data ?? []);
        }

      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const hasPieData = (data: any) =>
    data &&
    data.data &&
    Object.keys(data.data).length > 0;

  if (loading) {
    return <p style={{ padding: 32 }}>Đang tải dashboard...</p>;
  }

  return (
    <div className={styles.dashboard_container}>
      {/* OVERVIEW */}
      <div className={styles.sections}>
        <h1 className={styles.title}>Tổng quan</h1>
        <section className={styles.grid}>
          <Card
            title="Học sinh mới"
            value={String(overview?.overview.users_new.total ?? 0)}
            change={`${overview?.overview.users_new.change ?? 0}%`}
            tooltip="Số lượng học sinh mới đăng ký tham gia hệ thống trong tháng này, so với tháng trước."
          />
          <Card
            title="Số học sinh tham gia"
            value={String(overview?.overview.users.total ?? 0)}
            change={`${overview?.overview.users.change ?? 0}%`}
            tooltip="Tổng số học sinh đã tham gia cuộc thi trong tháng này, so với tháng trước."
          />
          <Card
            title="Bài thi đã nộp"
            value={String(overview?.overview.submits.total ?? 0)}
            change={`${overview?.overview.submits.change ?? 0}%`}
            tooltip="Số lượng bài thi đã được nộp thành công, bao gồm cả thi thử và chính thức so với tháng trước."
          />
          <Card
            title="Điểm trung bình"
            value={
              overview?.overview.score.total != null
                ? `${overview.overview.score.total} / 10`
                : "-- / 10"
            }
            change={`${overview?.overview.score.change ?? 0}%`}
            tooltip="Điểm trung bình của tất cả học sinh trong kỳ thi gần nhất, so với kỳ trước."
          />
          <Card
            title="Đạt điểm chuẩn"
            value={String(overview?.overview.standard_score.total ?? 0)}
            change={`${overview?.overview.standard_score.change ?? 0}%`}
            tooltip="Tỷ lệ học sinh đạt từ 5 điểm trở lên trong kỳ thi này, so với kỳ trước."
          />
          <Card
            title="Môn phổ biến nhất"
            value={overview?.overview.popular_subject.name ?? "Chưa có"}
            change={`+${overview?.overview.popular_subject.total ?? 0} lượt`}
            tooltip="Môn học có số lượt tham gia nhiều nhất trong kỳ thi này."
          />
        </section>
      </div>

      {/* LINE */}
      <div className={styles.sections}>
        <h1 className={styles.title}>Biểu đồ theo thời gian</h1>
        <div className={styles.line}>
          {lineData.length > 0 ? (
            <LineChartBox data={lineData} />
          ) : (
            <EmptyState text="Chưa có dữ liệu theo thời gian" />
          )}
        </div>
      </div>

      {/* BAR */}
      <div className={styles.sections}>
        <h1 className={styles.title}>Người dùng hoạt động</h1>
        <div className={styles.bar}>
          {dauData?.datasets?.[0]?.data?.length ? (
            <BarChartBox title="DAU" datasets={dauData} />
          ) : (
            <EmptyState text="Chưa có dữ liệu DAU" />
          )}

          {wauData?.datasets?.[0]?.data?.length ? (
            <BarChartBox title="WAU" datasets={wauData} />
          ) : (
            <EmptyState text="Chưa có dữ liệu WAU" />
          )}

          {mauData?.datasets?.[0]?.data?.length ? (
            <BarChartBox title="MAU" datasets={mauData} />
          ) : (
            <EmptyState text="Chưa có dữ liệu MAU" />
          )}
        </div>

      </div>

      {/* PIE */}
      <div className={styles.sections}>
        <h1 className={styles.title}>Biểu đồ tỉ lệ</h1>
        <div className={styles.pie_chart}>
          {hasPieData(pieScore) ? (
            <PieChartBox
              title="Tỷ lệ học sinh theo mức điểm"
              pieDataBySubject={pieScore.data}
              labels={pieScore.labels}
            />
          ) : (
            <EmptyState text="Chưa có dữ liệu phân bố điểm" />
          )}

          {hasPieData(pieSubjectJoin) ? (
            <PieChartBox
              title="Môn được làm nhiều nhất"
              pieDataBySubject={pieSubjectJoin.data}
              labels={pieSubjectJoin.labels}
            />
          ) : (
            <EmptyState text="Chưa có dữ liệu lượt làm theo môn" />
          )}

          {hasPieData(pieSubjectDone) ? (
            <PieChartBox
              title="Môn hoàn thành nhiều nhất"
              pieDataBySubject={pieSubjectDone.data}
              labels={pieSubjectDone.labels}
            />
          ) : (
            <EmptyState text="Chưa có dữ liệu hoàn thành theo môn" />
          )}
        </div>

      </div>

      {/* TABLE */}
      <div className="sections table_section">
        <h1 className={styles.title}>Thống kê theo ngày</h1>
        {tableData.length > 0 ? (
          <Table userStats={tableData} />
        ) : (
          <EmptyState text="Chưa có dữ liệu thống kê theo ngày" />
        )}
      </div>

    </div>
  );
}
