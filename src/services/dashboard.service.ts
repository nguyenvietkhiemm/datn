import pool, { query } from "../config/database";
import { DateProp } from "../models/dashboard.model";

export const DashBoardService = {
  async getDashboardStatsCard(date: DateProp) {
    const client = await pool.connect()
    try {
      await client.query("BEGIN");
      //overview
      const currentStart = new Date(date.year, date.month - 1, 1);
      const currentEnd = new Date(date.year, date.month, 1);

      const prevStart = new Date(date.year, date.month - 2, 1);
      const prevEnd = new Date(date.year, date.month - 1, 1);
      //bai nop, nguoi dung, diem dung
      const sql = `
      SELECT
        -- CURRENT MONTH
        COUNT(history_exam_id) FILTER (
          WHERE created_at >= $1 AND created_at < $2
        )::int AS current_submits,

        COUNT(DISTINCT user_id) FILTER (
          WHERE created_at >= $1 AND created_at < $2
        )::int AS current_users,

        ROUND(
          AVG(score) FILTER (
            WHERE created_at >= $1 AND created_at < $2
          ),
          2
        ) AS current_score,

        COUNT(score) FILTER (
          WHERE score >= 5
            AND created_at >= $1 AND created_at < $2
        )::int AS current_standard_score,
        
        -- PREVIOUS MONTH
        COUNT(history_exam_id) FILTER (
          WHERE created_at >= $3 AND created_at < $4
        )::int AS prev_submits,

        COUNT(DISTINCT user_id) FILTER (
          WHERE created_at >= $3 AND created_at < $4
        )::int AS prev_users,

        ROUND(
          AVG(score) FILTER (
            WHERE created_at >= $3 AND created_at < $4
          ),
          2
        ) AS prev_score,
        
        COUNT(score) FILTER (
          WHERE score >= 5
            AND created_at >= $3 AND created_at < $4
        )::int AS prev_standard_score

      FROM history_exam;
    `;

      const { rows } = await client.query(sql, [
        currentStart,
        currentEnd,
        prevStart,
        prevEnd,
      ]);

      const data = rows[0];

      const submitChange =
        data.prev_submits === 0
          ? 100
          : ((data.current_submits - data.prev_submits) / data.prev_submits) * 100;

      const userChange =
        data.prev_users === 0
          ? 100
          : ((data.current_users - data.prev_users) / data.prev_users) * 100;

      const scoreChange =
        data.prev_score == null
          ? 100
          : ((data.current_score - data.prev_score) / data.prev_score) * 100;

      const standardScoreChage =
        data.prev_standard_score === 0
          ? 100
          : ((data.current_standard_score - data.prev_standard_score) / data.prev_standard_score) * 100

      //mon pho bien nhat
      const sql1 = `
      SELECT
        sj.subject_id,
        sj.subject_name,
        COUNT(*)::int AS total
      FROM history_exam he
      JOIN exam e ON e.exam_id = he.exam_id
      JOIN topic t ON e.topic_id = t.topic_id
      JOIN subject sj ON sj.subject_id = t.subject_id
      WHERE he.created_at >= $1 AND he.created_at < $2
      GROUP BY sj.subject_id, sj.subject_name
      ORDER BY total DESC
      LIMIT 1;
      `
      const result1 = await client.query(sql1, [currentStart, currentEnd]);
      const data1 = result1.rows[0];
      //hoc sinh moi
      const sql2 = `
    SELECT 
    -- CURRENT MONTH
    COUNT(user_id) FILTER
    (
      WHERE created_at >= $1 AND created_at < $2
    )::int AS current_user_new ,
    
    -- PREVIOUS MONTH
    COUNT(user_id) FILTER
    (
      WHERE created_at >= $3 AND created_at < $4
    )::int AS prev_user_new 
    FROM "user"
    `
      const result2 = await client.query(sql2, [
        currentStart,
        currentEnd,
        prevStart,
        prevEnd,
      ]);

      const data2 = result2.rows[0];
      const userNewChange =
        data2.prev_user_new === 0
          ? 100
          : ((data2.current_user_new - data2.prev_user_new) / data2.prev_user_new) * 100;

      await client.query("COMMIT");
      return {
        overview: {
          submits: {
            total: data.current_submits,
            change: submitChange.toFixed(2),
          },
          users: {
            total: data.current_users,
            change: userChange.toFixed(2),
          },
          score: {
            total: data.current_score,
            change: scoreChange.toFixed(2),
          },
          users_new: {
            total: data2.current_user_new,
            change: userNewChange.toFixed(2),
          },
          popular_subject: {
            total: data1.total,
            name: data1.subject_name,
          },
          standard_score: {
            total: data.current_standard_score,
            change: standardScoreChage.toFixed(2),
          }
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async getDashboardStatsLine() {
    const sql = `
      SELECT
        to_char(d.day, 'Mon DD') AS date,
        COUNT(u.user_id)::int AS value
      FROM generate_series(
        CURRENT_DATE - INTERVAL '29 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) AS d(day)
      LEFT JOIN "user" u
        ON DATE(u.created_at) = d.day
      GROUP BY d.day
      ORDER BY d.day;
    `;

    const { rows } = await pool.query(sql);

    return {
      line: rows,
    };
  },

  async getDashboardStatsPie() {
    const client = await pool.connect();
    try {
      /* PIE SCORE DISTRIBUTION */
      const scoreSql = `
        SELECT
          sj.subject_name,
          COUNT(*) FILTER (WHERE he.score >= 8)  AS gioi,
          COUNT(*) FILTER (WHERE he.score >= 6.5 AND he.score < 8) AS kha,
          COUNT(*) FILTER (WHERE he.score >= 5 AND he.score < 6.5) AS trung_binh,
          COUNT(*) FILTER (WHERE he.score < 5) AS yeu
        FROM history_exam he
        JOIN exam e ON e.exam_id = he.exam_id
        JOIN topic t ON e.topic_id = t.topic_id
        JOIN subject sj ON sj.subject_id = t.subject_id
        GROUP BY sj.subject_name;
      `;

      const scoreRes = await client.query(scoreSql);

      const scoreData: any = {};
      scoreRes.rows.forEach((r) => {
        scoreData[r.subject_name] = [
          Number(r.gioi),
          Number(r.kha),
          Number(r.trung_binh),
          Number(r.yeu),
        ];
      });

      /* SUBJECT JOIN */
      const joinSql = `
        SELECT
          sj.subject_name,
          COUNT(*)::int AS total
        FROM history_exam he
        JOIN exam e ON e.exam_id = he.exam_id
        JOIN topic t ON e.topic_id = t.topic_id
        JOIN subject sj ON sj.subject_id = t.subject_id
        GROUP BY sj.subject_name;
      `;

      const joinRes = await client.query(joinSql);
      const joinData: any = {};
      joinRes.rows.forEach((r) => {
        joinData[r.subject_name] = r.total;
      });

      /* SUBJECT DONE (>=5) */
      const doneSql = `
        SELECT
          sj.subject_name,
          COUNT(*)::int AS total
        FROM history_exam he
        JOIN exam e ON e.exam_id = he.exam_id
        JOIN topic t ON e.topic_id = t.topic_id
        JOIN subject sj ON sj.subject_id = t.subject_id
        WHERE he.score >= 5
        GROUP BY sj.subject_name;
      `;

      const doneRes = await client.query(doneSql);
      const doneData: any = {};
      doneRes.rows.forEach((r) => {
        doneData[r.subject_name] = r.total;
      });

      return {
        score: {
          labels: ["Giỏi (≥8)", "Khá (6.5–7.9)", "Trung bình (5–6.4)", "Yếu (<5)"],
          data: scoreData,
        },
        subject_join: {
          labels: Object.keys(joinData),
          data: joinData,
        },
        subject_done: {
          labels: Object.keys(doneData),
          data: doneData,
        },
      };
    } finally {
      client.release();
    }
  },

  async getDashboardStatsBar() {
    const client = await pool.connect();
    try {
      /* DAU (7 days) */
      const dauSql = `
        SELECT
          to_char(d, 'Dy') AS label,
          COUNT(DISTINCT he.user_id)::int AS value
        FROM generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        ) d
        LEFT JOIN history_exam he
          ON DATE(he.created_at) = d
        GROUP BY d
        ORDER BY d;
      `;
      const dauRes = await client.query(dauSql);

      /* WAU (5 weeks) */
      const wauSql = `
        SELECT
          'Week ' || EXTRACT(WEEK FROM d)::int AS label,
          COUNT(DISTINCT he.user_id)::int AS value
        FROM generate_series(
          CURRENT_DATE - INTERVAL '4 weeks',
          CURRENT_DATE,
          INTERVAL '1 week'
        ) d
        LEFT JOIN history_exam he
          ON he.created_at >= d
         AND he.created_at < d + INTERVAL '1 week'
        GROUP BY d
        ORDER BY d;
      `;
      const wauRes = await client.query(wauSql);

      /* MAU (3 months) */
      const mauSql = `
        SELECT
          to_char(d, 'Mon') AS label,
          COUNT(DISTINCT he.user_id)::int AS value
        FROM generate_series(
          date_trunc('month', CURRENT_DATE) - INTERVAL '2 months',
          date_trunc('month', CURRENT_DATE),
          INTERVAL '1 month'
        ) d
        LEFT JOIN history_exam he
          ON date_trunc('month', he.created_at) = d
        GROUP BY d
        ORDER BY d;
      `;
      const mauRes = await client.query(mauSql);

      const mapChart = (rows: any[], label: string) => ({
        labels: rows.map((r) => r.label),
        datasets: [
          {
            label,
            data: rows.map((r) => r.value),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });

      return {
        dau: mapChart(dauRes.rows, "DAU"),
        wau: mapChart(wauRes.rows, "WAU"),
        mau: mapChart(mauRes.rows, "MAU"),
      };
    } finally {
      client.release();
    }
  },

  async getDashboardStatsTable() {
    const sql = `
      SELECT
        to_char(d.day, 'YYYY-MM-DD') AS date,
        COUNT(DISTINCT he.user_id)::int AS active_users,
        ROUND(
          COUNT(DISTINCT he.user_id)::decimal /
          NULLIF((SELECT COUNT(*) FROM "user"), 0),
          2
        ) AS user_ratio,
        ROUND(AVG(cnt)::numeric, 2) AS avg_session,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY cnt) AS median_session
      FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) d(day)
      LEFT JOIN (
        SELECT user_id, DATE(created_at) d, COUNT(*) cnt
        FROM history_exam
        GROUP BY user_id, DATE(created_at)
      ) he ON he.d = d.day
      GROUP BY d.day
      ORDER BY d.day;
    `;

    const { rows } = await pool.query(sql);

    return rows.map((r) => ({
      date: r.date,
      activeUsers: Number(r.active_users),
      userRatio: Number(r.user_ratio ?? 0),
      avgSession: Number(r.avg_session ?? 0),
      medianSession: Number(r.median_session ?? 0),
    }));
  }

};
