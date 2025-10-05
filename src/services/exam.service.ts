import { get } from "http";
import { Exam } from "../model/exam.model";
import { query } from "../config/database"

const ExamService = {
  async getAll(limit: number = 100, offset: number = 0): Promise<Exam[]> {
    const queryText = 'SELECT * FROM exam ORDER BY exam_id LIMIT $1 OFFSET $2';
    const result = await query(queryText, [limit, offset]);

    return result.rows;
  },

  async getById(id: number): Promise<Exam[] | null> {
    const result = await query(
      "SELECT * FROM exam WHERE exam_id = $1",
      [id]
    );
    return result.rows || null;
  },

  async create(data: Exam): Promise<Exam> {
    const queryText = `
      INSERT INTO exam (title, topic_id, time_limit, exam_schedule_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(queryText, [
      data.title,
      data.topic_id,
      data.time_limit,
      data.exam_schedule_id,
    ]);
    return result.rows[0];
  },

  async update(id: number, data: Exam): Promise<Exam | null> {
    const queryText = `
      UPDATE exam
      SET name = $1, subject = $2, date = $3
      WHERE exam_id = $4
      RETURNING *
    `;
    const result = await query(queryText, [
      data.title,
      data.topic_id,
      data.time_limit,
      data.exam_schedule_id,
      id
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
    const result = await query(
      "DELETE FROM exam WHERE exam_id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },
};

export default ExamService;
