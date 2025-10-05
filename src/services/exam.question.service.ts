import { query } from "../config/database";
import { ExamQuestion } from "../model/exam.question.model";

export const ExamQuestionService = {
    async add(data: ExamQuestion): Promise<ExamQuestion> {
        const result = await query(
            `INSERT INTO exam_question (exam_id, question_id)
             VALUES ($1, $2)
             RETURNING *`,
            [data.exam_id, data.question_id]
        );
        return result.rows[0];
    },

    async remove(exam_id: number, question_id: number): Promise<boolean> {
        const result = await query(
            `DELETE FROM exam_question WHERE exam_id = $1 AND question_id = $2`,
            [exam_id, question_id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}