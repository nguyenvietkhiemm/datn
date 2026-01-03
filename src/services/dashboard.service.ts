import { query } from "../config/database";
import { DateProp } from "../models/dashboard.model";

export const DashBoardService = {
  async getDashboardStats(date: DateProp) {

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

    const { rows } = await query(sql, [
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
    const result1 = await query(sql1, [currentStart, currentEnd]);
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
    const result2 = await query(sql2, [
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
  },
};
