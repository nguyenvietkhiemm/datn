import { Exam, DoExam } from "../models/exam.model"
import pool, { query } from "../config/database";
import { Question } from "../models/question.model"
import {redis} from "../config/redis";

const ExamService = {

  async getById(id: number): Promise<Question[] | null> {
    const queryText = `
          SELECT q.*
          FROM exam b
          JOIN question_exam qb ON b.exam_id = qb.exam_id
          JOIN question q ON qb.question_id = q.question_id
          WHERE b.exam_id = $1
        `;
    const result = await query(queryText, [id]);
    if (!result.rows.length) return null;

    // Lấy danh sách question_id
    const questionIds = result.rows.map((q) => q.question_id);

    //lay danh sach cau tra loi
    const ansRes = await query(
      "SELECT answer_id, question_id, answer_content FROM answer WHERE question_id = ANY($1)",
      [questionIds]
    );

    // Gom answer theo question_id
    const answerMap = ansRes.rows.reduce((acc, ans) => {
      (acc[ans.question_id] ||= []).push(ans);
      return acc;
    }, {} as Record<number, any[]>);

    // Gắn answers vào từng question
    const questions = result.rows.map((q) => ({
      ...q,
      answers: answerMap[q.question_id] || [],
    }));

    return questions as Question[];
  },

  async create(data: Exam): Promise<Exam> {
    const queryText = `
      INSERT INTO exam (exam_name, topic_id, time_limit, exam_schedule_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(queryText, [
      data.exam_name,
      data.topic_id,
      data.time_limit,
      data.exam_schedule_id,
    ]);
    return result.rows[0];
  },

  async update(id: number, data: Exam): Promise<Exam | null> {
    const queryText = `
      UPDATE exam
      SET exam_name = $1, topic_id = $2, time_limit = $3, exam_schedule_id = $4
      WHERE exam_id = $5
      RETURNING *
    `;
    const result = await query(queryText, [
      data.exam_name,
      data.topic_id,
      data.time_limit,
      data.exam_schedule_id,
      data.exam_id,
    ]);
    return result.rows[0] || null;
  },

  async setAvailable(id: number, available: boolean): Promise<boolean> {
    const result = await query(
      "UPDATE exam SET available = $1 WHERE exam_id = $2",
      [available, id]
    );
    return (result.rowCount ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const result = await query("DELETE FROM exam WHERE exam_id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async list(page: number, status: string, searchValue: string, topicIds: number[]): Promise<({ exams: Exam[]; totalPages: number }) | []> {
    const limit = 12;
    const offset = (page - 1) * limit;

    let conditions = [];
    let params = [];
    let idx = 1;

    // Search
    if (searchValue.trim() !== "") {
      conditions.push(`(LOWER(e.exam_name) LIKE LOWER($${idx}) OR LOWER(t.title) LIKE LOWER($${idx}))`);
      params.push(`%${searchValue}%`);
      idx++;
    }

    // Status
    if (status !== "All") {
      conditions.push(`e.available = $${idx}`);
      params.push(status);
      idx++;
    }

    // Topic filter
    if (topicIds.length > 0) {
      conditions.push(`e.topic_id = ANY($${idx})`);
      params.push(topicIds);
      idx++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const queryText = `
          SELECT 
            e.exam_name, e.topic_id, e.time_limit, e.exam_id, e.created_at, e.available, e.description,
            t.title AS topic_name,
            es.start_time, es.end_time,
            sj.subject_type,
            COALESCE(c.total_contestants, 0) AS contestant_count
          FROM exam e
          JOIN topic t ON e.topic_id = t.topic_id
          JOIN exam_schedule es ON es.exam_schedule_id = e.exam_schedule_id
          JOIN subject sj ON sj.subject_id = topic_id
          LEFT JOIN (
            SELECT exam_id, COUNT(*) AS total_contestants
            FROM contestants
            GROUP BY exam_id
          ) c ON c.exam_id = e.exam_id
          ${whereClause}
          ORDER BY e.exam_id DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

    const result = await query(queryText, params);

    // Count total
    const countQuery = `
          SELECT COUNT(*) AS total
          FROM exam e
          JOIN topic t ON e.topic_id = t.topic_id
          JOIN exam_schedule es ON es.exam_schedule_id = e.exam_schedule_id
          ${whereClause}
        `;

    const countResult = await query(countQuery, params);

    const totalPages = Math.ceil(countResult.rows[0].total / limit);
    return { exams: result.rows, totalPages };
  },

  async submit(
    exam_id: number,
    user_id: number,
    do_exam: DoExam[],
    time_test : number,
    subject_type: number
  ): Promise<{ score: number; correct_count: number }> {
    const client = await pool.connect();
  
    try {
      await client.query("BEGIN");
  
      // 1. Lấy toàn bộ câu hỏi + đáp án đúng
      const sql = `
        SELECT 
          q.question_id,
          q.type_question,
          a.answer_id,
          a.answer_content,
          a.is_correct
        FROM question_exam qe
        JOIN question q ON q.question_id = qe.question_id
        JOIN answer a ON a.question_id = q.question_id
        WHERE qe.exam_id = $1
        ORDER BY q.question_id ASC
      `;
  
      const { rows } = await client.query(sql, [exam_id]);
  
      // Map dữ liệu
      const map = new Map<
        number,
        {
          type_question: number;
          correct_answers: number[];
          correct_text?: string;
        }
      >();
  
      for (const r of rows) {
        if (!map.has(r.question_id)) {
          map.set(r.question_id, {
            type_question: r.type_question,
            correct_answers: [],
            correct_text: undefined
          });
        }
  
        const current = map.get(r.question_id)!;
  
        // TH trắc nghiệm (loại 1 & 2)
        if (r.is_correct && r.type_question !== 3) {
          current.correct_answers.push(r.answer_id);
        }
  
        // TH tự luận
        if (r.type_question === 3 && r.is_correct) {
          current.correct_text = r.answer_content;
        }
      }
  
      // ======== CHẤM ĐIỂM ==========
      let score = 0;
      let correct_count = 0;
  
      for (const user of do_exam) {
        const info = map.get(user.question_id);
        if (!info) continue;
  
        const { type_question, correct_answers, correct_text } = info;
  
        // ==== Loại 1: Trắc nghiệm 1 đáp án ====
        if (type_question === 1) {
          if (user.user_answer[0] == correct_answers[0]) {
            score += 0.25
          }
  
          await client.query(
            `INSERT INTO user_exam_answer (exam_id, user_id, answer_id)
             VALUES ($1, $2, $3)`,
            [exam_id, user_id, user.user_answer[0]]
          );
        }
  
        // ==== Loại 2: Trắc nghiệm nhiều đáp án ====
        else if (type_question === 2) {
          const correctSelected = user.user_answer.filter(a =>
            correct_answers.includes(Number(a))
          ).length;
          const correct = user.user_answer.filter(a => correct_answers.includes(Number(a))).length;
          if (correct === 1) {
              score += 0.1
          } else if (correct === 2) {
              score += 0.25
          } else if (correct === 3) {
              score += 0.5
          } else score += 1;
  
          for (const ans of user.user_answer) {
            if (!isNaN(Number(ans))) {
              await client.query(
                `INSERT INTO user_exam_answer (exam_id, user_id, answer_id)
                 VALUES ($1, $2, $3)`,
                [exam_id, user_id, ans]
              );
            }
          }
        }
  
        // ==== Loại 3: Tự luận ====
        else if (type_question === 3) {
          const correct_text = correct_answers[0];
          const user_text = user.user_answer[0];
          if ((String(user_text).trim().toLowerCase() === String(correct_text).trim().toLowerCase())) {
              if (subject_type === 1) {
                  score += 0.5
              } else {
                  score += 0.25
              }
          }
  
          await client.query(
            `INSERT INTO user_exam_answer (exam_id, user_id, user_answer_text)
             VALUES ($1, $2, $3)`,
            [exam_id, user_id, user.user_answer[0]]
          );
        }
      }
      
      //tinh gia tri de luu xep hang redis
      const final_score = score * 1000000000 - time_test
      //su dung Zset cho xep hang
      await redis.zadd(
        `exam:${exam_id}:ranking`,
        "GT",  
        final_score,
        user_id.toString()
      );

      // su dung list cho lich su lambai
      await redis.lpush(
        `user:${user_id}:exam_history`,
        JSON.stringify({
          exam_id: exam_id,
          score: score,
          time_test: time_test,
          submitted_at: Date.now()
        })
      );

      await client.query("COMMIT");
  
      return { score, correct_count };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async getExamRanking(exam_id: number): Promise<{
    user_id: number;
    final_score: number;
  }[]> {
    try {
      const limit = 10;
  
      const data = await redis.zrevrange(
        `exam:${exam_id}:ranking`,
        0,
        limit - 1,
        "WITHSCORES"
      );
  
      const rank: {
        user_id: number;
        final_score: number;
      }[] = [];
  
      for (let i = 0; i < data.length; i += 2) {
        rank.push({
          user_id: Number(data[i]),
          final_score: Number(data[i + 1]),
        });
      }
  
      return rank;
  
    } catch (err) {
      console.error("Lỗi lấy xếp hạng", err);
      return [];
    }
  },  

  async getUserExamHistory(
    user_id: number
  ): Promise<{
    user_id: number;
    history: {
      exam_id: number;
      score: number;
      time_test: number;
      submitted_at: Date;
    }[];
  }> {
    try {
      const list = await redis.lrange(`user:${user_id}:exam_history`, 0, -1);
  
      if (!list || list.length === 0) {
        return {
          user_id,
          history: []
        };
      }
  
      const history = list.map(item => {
        try {
          const parsed = JSON.parse(item);
  
          // Convert submitted_at sang kiểu Date nếu là string
          if (parsed.submitted_at) {
            parsed.submitted_at = new Date(parsed.submitted_at);
          }
  
          return parsed;
        } catch (e) {
          console.error("Lỗi parse lịch sử làm bài:", e, item);
          return null;
        }
      }).filter(Boolean);
  
      return {
        user_id,
        history
      };
  
    } catch (err) {
      console.error("Lỗi lấy lịch sử làm bài:", err);
      throw new Error("Không thể lấy lịch sử làm bài");
    }
  },  

  async markOverTime() {
    try {

      const row = await query(`
        UPDATE exam e
        SET available = false
        FROM exam_schedule es
        WHERE es.exam_schedule_id = e.exam_schedule_id
          AND es.end_time < (NOW() + INTERVAL '7 hours');
        `);
    } catch (err) {
      console.error("Lỗi khi cập nhật lịch quá hạn:", err);
    }
  }

};

export default ExamService;
