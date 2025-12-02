import { Exam, DoExam } from "../models/exam.model"
import pool, { query } from "../config/database";
import { Question } from "../models/question.model"

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
            e.exam_name, e.topic_id, e.time_limit, e.exam_id, e.created_at, e.available,
            t.title,
            es.start_time, es.end_time
          FROM exam e
          JOIN topic t ON e.topic_id = t.topic_id
          JOIN exam_schedule es ON es.exam_schedule_id = e.exam_schedule_id
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

  // async submit(exam_id: number, do_exam: DoExam[]): Promise<{ score: number, correct_count: number }> {
  //   const client = await pool.connect();
  //   try {
  //     await client.query("BEGIN");

  //     //lay dap an dung
  //     const query_answer_correct = `
  //                   SELECT q.type_question, q.point_question, a.answer_content, a.is_correct
  //                   FROM question exam e
  //                   JOIN question_exam qe ON e.exam_id = qe.exam_id
  //                   JOIN question q ON q.question_id = qe.question_id
  //                   JOIN answer a ON a.question_id = q.question_id
  //                   WHERE answer_id =$1
  //                   ODER BY q.question_id DESC
  //                   `
  //     const {rows : answer_correct} = await client.query(query_answer_correct, [exam_id])

  //     const correctMap = new Map<number, number>();
  //     const pointMap = new Map<number, number>(); 
  //     const typeMap = new Map<number, number>();

  //   } catch (error) {
  //     console.log(error);
  //     client.query("ROLLBACK")
  //   } finally{
  //     client.query("COMMIT")
  //   }
  // },

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
