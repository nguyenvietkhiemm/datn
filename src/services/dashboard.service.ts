import pool, { query } from "../config/database";
import { DateProp } from "../models/dashboard.model";

export const DashBoardService = {
async getDashboardStatsCard(date: DateProp) {
  const client = await pool.connect();
  try {
    const currentStart = new Date(Date.UTC(date.year, date.month - 1, 1));
    const currentEnd   = new Date(Date.UTC(date.year, date.month, 1));
    const prevStart    = new Date(Date.UTC(date.year, date.month - 2, 1));
    const prevEnd      = new Date(Date.UTC(date.year, date.month - 1, 1));

    const sql = `
      SELECT
        COUNT(history_exam_id) FILTER (
          WHERE created_at >= $1 AND created_at < $2
        )::int AS current_submits,

        COUNT(DISTINCT user_id) FILTER (
          WHERE created_at >= $1 AND created_at < $2
        )::int AS current_users,

        ROUND(
          COALESCE(AVG(score) FILTER (
            WHERE created_at >= $1 AND created_at < $2
          ), 0),
          2
        ) AS current_score,

        COUNT(score) FILTER (
          WHERE score >= 5
            AND created_at >= $1 AND created_at < $2
        )::int AS current_standard_score,

        COUNT(history_exam_id) FILTER (
          WHERE created_at >= $3 AND created_at < $4
        )::int AS prev_submits,

        COUNT(DISTINCT user_id) FILTER (
          WHERE created_at >= $3 AND created_at < $4
        )::int AS prev_users,

        ROUND(
          COALESCE(AVG(score) FILTER (
            WHERE created_at >= $3 AND created_at < $4
          ), 0),
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

    const d = rows[0];

    const calcChange = (c: number, p: number) =>
      p === 0 ? (c === 0 ? 0 : 100) : ((c - p) / p) * 100;

    const sql1 = `
      SELECT
        sj.subject_name,
        COUNT(*)::int AS total
      FROM history_exam he
      JOIN exam e ON e.exam_id = he.exam_id
      JOIN topic t ON e.topic_id = t.topic_id
      JOIN subject sj ON sj.subject_id = t.subject_id
      WHERE he.created_at >= $1 AND he.created_at < $2
      GROUP BY sj.subject_name
      ORDER BY total DESC
      LIMIT 1;
    `;

    const popular = (await client.query(sql1, [currentStart, currentEnd])).rows[0]
      ?? { subject_name: null, total: 0 };

    const sql2 = `
      SELECT
        COUNT(user_id) FILTER (
          WHERE created_at >= $1 AND created_at < $2
        )::int AS current_user_new,
        COUNT(user_id) FILTER (
          WHERE created_at >= $3 AND created_at < $4
        )::int AS prev_user_new
      FROM "user";
    `;

    const u = (await client.query(sql2, [
      currentStart,
      currentEnd,
      prevStart,
      prevEnd,
    ])).rows[0];

    return {
      overview: {
        submits: {
          total: d.current_submits,
          change: calcChange(d.current_submits, d.prev_submits).toFixed(2),
        },
        users: {
          total: d.current_users,
          change: calcChange(d.current_users, d.prev_users).toFixed(2),
        },
        score: {
          total: d.current_score,
          change: calcChange(d.current_score, d.prev_score).toFixed(2),
        },
        users_new: {
          total: u.current_user_new,
          change: calcChange(u.current_user_new, u.prev_user_new).toFixed(2),
        },
        standard_score: {
          total: d.current_standard_score,
          change: calcChange(
            d.current_standard_score,
            d.prev_standard_score
          ).toFixed(2),
        },
        popular_subject: {
          name: popular.subject_name,
          total: popular.total,
        },
      },
    };
  } finally {
    client.release();
  }
}, 




async getDashboardStatsLine() {
  const sql = `
    SELECT
      to_char(d.day, 'YYYY-MM-DD') AS date,
      COUNT(u.user_id)::int AS value
    FROM generate_series(
      (CURRENT_DATE AT TIME ZONE 'UTC') - INTERVAL '29 days',
      (CURRENT_DATE AT TIME ZONE 'UTC'),
      INTERVAL '1 day'
    ) AS d(day)
    LEFT JOIN "user" u
      ON u.created_at >= d.day
     AND u.created_at < d.day + INTERVAL '1 day'
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
    const sql = `
      SELECT
        sj.subject_name,
        -- PIE SCORE DISTRIBUTION
        COUNT(*) FILTER (WHERE he.score >= 8) AS gioi,
        COUNT(*) FILTER (WHERE he.score >= 6.5 AND he.score < 8) AS kha,
        COUNT(*) FILTER (WHERE he.score >= 5 AND he.score < 6.5) AS trung_binh,
        COUNT(*) FILTER (WHERE he.score < 5) AS yeu,
        -- SUBJECT JOIN (tổng số lần làm bài)
        COUNT(*) AS total_join,
        -- SUBJECT DONE (score >=5)
        COUNT(*) FILTER (WHERE he.score >= 5) AS total_done
      FROM subject sj
      LEFT JOIN topic t ON t.subject_id = sj.subject_id
      LEFT JOIN exam e ON e.topic_id = t.topic_id
      LEFT JOIN history_exam he ON he.exam_id = e.exam_id
      GROUP BY sj.subject_name
      ORDER BY sj.subject_name;
    `;

    const res = await client.query(sql);

    const scoreData: Record<string, number[]> = {};
    const joinData: Record<string, number> = {};
    const doneData: Record<string, number> = {};

    res.rows.forEach((r) => {
      const subject = r.subject_name;
      scoreData[subject] = [
        Number(r.gioi),
        Number(r.kha),
        Number(r.trung_binh),
        Number(r.yeu),
      ];
      joinData[subject] = Number(r.total_join);
      doneData[subject] = Number(r.total_done);
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
