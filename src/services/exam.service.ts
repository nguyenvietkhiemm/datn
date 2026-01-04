import { Exam, DoExam, UserAnswerGrouped, AnswerCorrectGrouped } from "../models/exam.model"
import pool, { query } from "../config/database";
import { Question } from "../models/question.model"
import { redis } from "../config/redis";
import { groupQuestionsByTypeSafe, QuestionGroup } from "../utils/helper";

const ExamService = {

  async getById(
    examId: number
  ): Promise<{
    question: QuestionGroup | null;
    subject_type: number | null;
  }> {

    const queryText = `
      SELECT
        q.*,
  
        -- IMAGE QUESTION
        COALESCE(
          (
            SELECT json_agg(iq.image_link)
            FROM image_question iq
            WHERE iq.question_id = q.question_id
          ),
          '[]'
        ) AS images,
  
        -- ANSWERS (CÓ is_correct – xử lý ở controller)
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'answer_id', a.answer_id,
                'question_id', a.question_id,
                'answer_content', a.answer_content,
                'is_correct', a.is_correct,
                'images',
                COALESCE(
                  (
                    SELECT json_agg(ia.image_link)
                    FROM image_answer ia
                    WHERE ia.answer_id = a.answer_id
                  ),
                  '[]'
                )
              )
            )
            FROM answer a
            WHERE a.question_id = q.question_id
          ),
          '[]'
        ) AS answers
  
      FROM exam e
      JOIN question_exam qe ON e.exam_id = qe.exam_id
      JOIN question q ON qe.question_id = q.question_id
      WHERE e.exam_id = $1
      ORDER BY qe.question_id ASC
    `;

    const questionResult = await query(queryText, [examId]);

    const subjectTypeQuery = `
      SELECT s.subject_type
      FROM exam e
      JOIN topic t ON t.topic_id = e.topic_id
      JOIN subject s ON s.subject_id = t.subject_id
      WHERE e.exam_id = $1
    `;

    const subjectTypeResult = await query(subjectTypeQuery, [examId]);
    const subject_type: number | null =
      subjectTypeResult.rows[0]?.subject_type ?? null;

    const groupedQuestions = groupQuestionsByTypeSafe(
      questionResult.rows as Question[]
    );

    // LẤY subject_type

    return {
      question: groupedQuestions,
      subject_type
    };
  },

  async create(data: Exam): Promise<Exam> {
    const queryText = `
      INSERT INTO exam (exam_name, topic_id, time_limit, exam_schedule_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(queryText, [
      data.exam_name,
      data.topic_id,
      data.time_limit,
      data.exam_schedule_id,
      data.description
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

  async list(page: number,
    status: string,
    searchValue: string,
    topicIds: number | "All",
    subject_id: number | "All"
  ): Promise<({ exams: Exam[]; totalPages: number }) | []> {
    const limit = 12;
    const offset = (page - 1) * limit;

    let conditions = [];
    let params = [];
    let idx = 1;

    // Search
    if (searchValue.trim() !== "") {
      conditions.push(`
        (
          unaccent(lower(e.exam_name)) LIKE unaccent(lower($${idx}))
          OR
          unaccent(lower(t.title)) LIKE unaccent(lower($${idx}))
        )
      `);
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
    if (topicIds !== "All") {
      conditions.push(`e.topic_id = ($${idx})`);
      params.push(topicIds);
      idx++;
    }

    //subject
    if (subject_id !== "All") {
      conditions.push(`sj.subject_id = ($${idx})`);
      params.push(subject_id);
      idx++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const queryText = `
          SELECT 
            e.exam_name, e.topic_id, e.time_limit, e.exam_id, e.created_at, e.available, e.description,
            t.title AS topic_name,
            es.start_time, es.end_time,
            sj.subject_type, sj.subject_name,
            COALESCE(c.total_contestants, 0) AS contestant_count
          FROM exam e
          JOIN topic t ON e.topic_id = t.topic_id
          JOIN exam_schedule es ON es.exam_schedule_id = e.exam_schedule_id
          JOIN subject sj ON sj.subject_id = t.subject_id
          LEFT JOIN (
            SELECT exam_id, COUNT(DISTINCT user_id) AS total_contestants
            FROM history_exam
            GROUP BY exam_id
          ) c ON c.exam_id = e.exam_id         
          ${whereClause}
          ORDER BY e.exam_id DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

    const result = await query(queryText, params);

    const exams = result.rows;

    // Lấy top 3 của mỗi exam
    const examsWithTop3 = await Promise.all(
      exams.map(async (exam) => {
        console.log(exam.end_time);

        // Lấy top 3 từ ZSET
        const top3Raw = await redis.zrevrange(
          `exam:${exam.exam_id}:ranking`,
          0,
          2,
          "WITHSCORES"
        );

        const top3 = [];

        // Duyệt theo cặp (member, score)
        for (let i = 0; i < top3Raw.length; i += 2) {
          const member = JSON.parse(top3Raw[i]); // { user_id, user_name }
          const final_score = Number(top3Raw[i + 1]);

          // Lấy điểm thật + thời gian thật từ HASH
          const detail = await redis.hgetall(
            `exam:${exam.exam_id}:user:${member.user_id}`
          );

          top3.push({
            user_id: Number(member.user_id),
            user_name: member.user_name,
            score: Number(detail.score || 0),
            time_test: Number(detail.time_test || 0),
            final_score
          });
        }

        return {
          ...exam,
          top3,
        };
      })
    );

    // Count total
    const countQuery = `
          SELECT COUNT(*) AS total
          FROM exam e
          JOIN topic t ON e.topic_id = t.topic_id
          JOIN exam_schedule es ON es.exam_schedule_id = e.exam_schedule_id
          JOIN subject sj ON sj.subject_id = t.subject_id
          ${whereClause}
        `;

    const countResult = await query(countQuery, params);

    const totalPages = Math.ceil(countResult.rows[0].total / limit);

    return { exams: examsWithTop3, totalPages };
  },

  async submit(
    exam_id: number,
    user_id: number,
    do_exam: DoExam[],
    time_test: number,
    subject_type: number,
    user_name: string
  ): Promise<{ score: number; history_exam_id: number }> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      //  Lấy đáp án đúng
      const { rows } = await client.query(
        `
        SELECT q.question_id, q.type_question, a.answer_id, a.answer_content
        FROM question_exam qe
        JOIN question q ON q.question_id = qe.question_id
        JOIN answer a ON a.question_id = q.question_id
        WHERE qe.exam_id = $1 AND a.is_correct = true
        `,
        [exam_id]
      );

      // Map đáp án
      const map = new Map<number, any>();
      for (const r of rows) {
        if (!map.has(r.question_id)) {
          map.set(r.question_id, {
            type_question: r.type_question,
            correct_answers: [],
            correct_text: undefined
          });
        }
        const cur = map.get(r.question_id);
        r.type_question === 3
          ? (cur.correct_text = r.answer_content)
          : cur.correct_answers.push(r.answer_id);
      }

      //  Chấm điểm
      let score = 0;
      for (const user of do_exam) {
        const info = map.get(user.question_id);
        if (!info || !user.user_answer || user.user_answer.length === 0) continue;

        /* ===== TYPE 1 ===== */
        if (info.type_question === 1) {
          if (Number(user.user_answer[0]) === info.correct_answers[0]) {
            score += 0.25;
          }
        }

        /* ===== TYPE 2 ===== */
        else if (info.type_question === 2) {
          const correctCount = user.user_answer.filter(a =>
            info.correct_answers.includes(Number(a))
          ).length;

          if (correctCount === info.correct_answers.length) score += 1;
          else if (correctCount === 3) score += 0.5;
          else if (correctCount === 2) score += 0.25;
          else if (correctCount === 1) score += 0.1;
        }

        /* ===== TYPE 3 ===== */
        else if (info.type_question === 3) {
          const userText = String(user.user_answer[0] || "")
            .trim()
            .toLowerCase();

          const correctText = String(info.correct_text || "")
            .trim()
            .toLowerCase();

          if (userText && userText === correctText) {
            score += subject_type === 1 ? 0.5 : 0.25;
          }
        }
      }

      // Insert history_exam (SAU khi có score)
      const historyResult = await client.query(
        `
        INSERT INTO history_exam (user_id, exam_id, score, time_test)
        VALUES ($1, $2, $3, $4)
        RETURNING history_exam_id
        `,
        [user_id, exam_id, score, time_test]
      );

      const history_exam_id = historyResult.rows[0].history_exam_id;

      // Insert user_exam_answer
      for (const user of do_exam) {
        for (const ans of user.user_answer) {

          // TRẮC NGHIỆM
          if (typeof ans === "number") {
            await client.query(
              `
              INSERT INTO user_exam_answer
              (history_exam_id, exam_id, user_id, question_id, answer_id, user_answer_text)
              VALUES ($1, $2, $3, $4, $5, NULL)
              `,
              [
                history_exam_id,
                exam_id,
                user_id,
                user.question_id,
                ans,
              ]
            );
          }

          // TỰ LUẬN
          else if (typeof ans === "string") {
            await client.query(
              `
              INSERT INTO user_exam_answer
              (history_exam_id, exam_id, user_id, question_id, answer_id, user_answer_text)
              VALUES ($1, $2, $3, $4, NULL, $5)
              `,
              [
                history_exam_id,
                exam_id,
                user_id,
                user.question_id,
                ans,
              ]
            );
          }
        }
      }

      // Redis ranking
      const scoreInt = Math.floor(score * 1000);
      const final_score =
        scoreInt * 1_000_000 + (1_000_000 - time_test);
      await redis.zadd(
        `exam:${exam_id}:ranking`,
        "GT",
        final_score,
        JSON.stringify({ user_id, user_name })
      );

      await client.query("COMMIT");
      return { score, history_exam_id };

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async getExamRanking(
    exam_id: number,
    user_id: number,
    user_name: string,
    page: number
  ): Promise<{
    rank: {
      user_id: number;
      user_name: string;
      score: number;
      time_test: number;
      final_score: number;
    }[];
    my_rank: {
      rank: number;
      score: number;
      time_test: number;
    } | null;
    total_page: number;
    total_rank: number;
  }> {
    try {
      const limit = 10;
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      // ✅ tổng số user trong BXH
      const total_rank = await redis.zcard(
        `exam:${exam_id}:ranking`
      );
      const total_page = Math.ceil(total_rank / limit);

      const redisData = await redis.zrevrange(
        `exam:${exam_id}:ranking`,
        start,
        end,
        "WITHSCORES"
      );

      if (!redisData.length) {
        return {
          rank: [],
          my_rank: null,
          total_page,
          total_rank
        };
      }

      const userIds: number[] = [];
      const redisMembers: {
        user_id: number;
        user_name: string;
        final_score: number;
      }[] = [];

      for (let i = 0; i < redisData.length; i += 2) {
        const member = JSON.parse(redisData[i]);
        const final_score = Number(redisData[i + 1]);

        userIds.push(member.user_id);
        redisMembers.push({
          user_id: member.user_id,
          user_name: member.user_name,
          final_score
        });
      }

      const scoreResult = await pool.query(
        `
          SELECT user_id, score, time_test
          FROM history_exam
          WHERE exam_id = $1
            AND user_id = ANY($2)
        `,
        [exam_id, userIds]
      );

      const scoreMap = new Map<
        number,
        { score: number; time_test: number }
      >();

      for (const row of scoreResult.rows) {
        scoreMap.set(row.user_id, {
          score: Number(row.score),
          time_test: Number(row.time_test)
        });
      }

      const rank = redisMembers.map(m => {
        const detail = scoreMap.get(m.user_id);
        return {
          user_id: m.user_id,
          user_name: m.user_name,
          score: detail?.score ?? 0,
          time_test: detail?.time_test ?? 0,
          final_score: m.final_score
        };
      });

      // lấy hạng của user hiện tại
      const memberKey = JSON.stringify({ user_id, user_name });
      const myRankIndex = await redis.zrevrank(
        `exam:${exam_id}:ranking`,
        memberKey
      );

      let my_rank = null;

      if (myRankIndex !== null) {
        const myScoreResult = await pool.query(
          `
            SELECT score, time_test
            FROM history_exam
            WHERE exam_id = $1
              AND user_id = $2
            ORDER BY history_exam_id DESC
            LIMIT 1
          `,
          [exam_id, user_id]
        );

        const myRow = myScoreResult.rows[0];
        if (myRow) {
          my_rank = {
            rank: myRankIndex + 1,
            score: Number(myRow.score),
            time_test: Number(myRow.time_test)
          };
        }
      }

      return {
        rank,
        my_rank,
        total_page,
        total_rank
      };

    } catch (err) {
      console.error("Lỗi lấy xếp hạng:", err);
      return {
        rank: [],
        my_rank: null,
        total_page: 0,
        total_rank: 0
      };
    }
  },

  async getUserListExamHistory(
    user_id: number
  ): Promise<{
    history: {
      hsitory_exam_id: number;
      score: number;
      time_test: number;
      created_at: Date;
    }[];
  }> {
    try {
      const listQuery =
        `SELECT he.history_exam_id, he.score, he.time_test, he.created_at, he.exam_id, e.exam_name
      FROM history_exam he
      JOIN exam e ON e.exam_id = he.exam_id
      WHERE user_id=$1
      ORDER BY history_exam_id DESC`
      const list = await query(listQuery, [user_id])
      if (!list || list.rows.length === 0) {
        return {
          history: []
        };
      }

      return {
        history: list.rows
      };

    } catch (err) {
      console.error("Lỗi lấy lịch sử làm bài:", err);
      throw new Error("Không thể lấy lịch sử làm bài");
    }
  },

  async getUserAnswer(
    history_exam_id: number,
    exam_id: number
  ): Promise<{
    score: number | null;
    questions: Record<number, any[]>;
  }> {

    /* ================= SCORE ================= */
    const scoreResult = await pool.query(
      `SELECT score FROM history_exam WHERE history_exam_id = $1`,
      [history_exam_id]
    );
    const score = scoreResult.rows[0]?.score ?? null;

    /* ================= QUESTIONS + CORRECT ANSWERS ================= */
    const questionSql = `
      SELECT
        q.question_id,
        q.question_content,
        q.type_question,

        -- IMAGE QUESTION
        COALESCE(
          (
            SELECT json_agg(iq.image_link)
            FROM image_question iq
            WHERE iq.question_id = q.question_id
          ),
          '[]'
        ) AS images,

        json_agg(
          DISTINCT jsonb_build_object(
            'answer_id', a.answer_id,
            'answer_content', a.answer_content,
            'images',
                COALESCE(
                  (
                    SELECT json_agg(ia.image_link)
                    FROM image_answer ia
                    WHERE ia.answer_id = a.answer_id
                  ),
                  '[]'
                )
          )
        ) FILTER (WHERE a.is_correct = true) AS correct_answers
  
      FROM question_exam qe
      JOIN question q ON q.question_id = qe.question_id
      LEFT JOIN answer a ON a.question_id = q.question_id
      WHERE qe.exam_id = $1
      GROUP BY q.question_id
      ORDER BY q.question_id
    `;
    const questionResult = await pool.query(questionSql, [exam_id]);

    /* ================= USER ANSWERS ================= */
    const userSql = `
      SELECT
        u.question_id,
        u.answer_id,
        u.user_answer_text,
        a.answer_content
      FROM user_exam_answer u
      LEFT JOIN answer a ON a.answer_id = u.answer_id
      WHERE u.history_exam_id = $1
    `;
    const userResult = await pool.query(userSql, [history_exam_id]);

    /* ================= MAP USER ANSWERS ================= */
    const userMap = new Map<number, {
      answer_id: number | null;
      answer_content: string | null;
    }[]>();

    for (const row of userResult.rows) {
      if (!userMap.has(row.question_id)) {
        userMap.set(row.question_id, []);
      }

      userMap.get(row.question_id)!.push({
        answer_id: row.answer_id ?? null,
        answer_content: row.answer_content ?? row.user_answer_text ?? null
      });
    }

    /* ================= GROUP BY TYPE QUESTION ================= */
    const grouped: Record<number, any[]> = { 1: [], 2: [], 3: [] };

    for (const q of questionResult.rows) {
      grouped[q.type_question].push({
        question_id: q.question_id,
        question_content: q.question_content,
        type_question: q.type_question,
        images: q.images ?? [],
        correct_answers: q.correct_answers ?? [],
        user_answers: userMap.get(q.question_id) ?? []
      });
    }

    return {
      score,
      questions: grouped
    };
  },

  async checkDoExam(
    exam_id: number,
    user_id: number
  ): Promise<{ check: boolean; reason?: string }> {

    const hasDone = await redis.exists(
      `exam:${exam_id}:user:${user_id}`
    );

    if (hasDone) {
      return {
        check: false,
        reason: "ALREADY_DONE"
      };
    }

    const { rows } = await query(
      `
      SELECT 
        e.available,
        es.end_time
      FROM exam e
      LEFT JOIN exam_schedule es 
        ON e.exam_schedule_id = es.exam_schedule_id
      WHERE e.exam_id = $1
      `,
      [exam_id]
    );

    if (!rows.length) {
      return {
        check: false,
        reason: "EXAM_NOT_FOUND"
      };
    }

    const { available, end_time } = rows[0];

    if (!available) {
      return {
        check: false,
        reason: "DISABLED"
      };
    }

    if (end_time && end_time < new Date()) {
      return {
        check: false,
        reason: "EXPIRED"
      };
    }

    return { check: true };
  },

  async getQuestionIdExam(exam_id: number): Promise<number[]> {
    const questionQuery = `SELECT question_id FROM question_exam WHERE exam_id=$1`
    const questionRows = await query(questionQuery, [exam_id])
    return questionRows.rows.map(
      (row: { question_id: number }) => row.question_id
    );
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
