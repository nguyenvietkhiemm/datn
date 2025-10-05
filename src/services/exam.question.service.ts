import { query } from "../config/database";
import { BankQuestion } from "../model/bank.question.model";
import { ExamQuestion } from "../model/exam.question.model";

export const ExamQuestionService = {
    async add(data: ExamQuestion): Promise<ExamQuestion> {
        const result = await query(
            `INSERT INTO question_exam (exam_id, question_id)
             VALUES ($1, $2)
             RETURNING *`,
            [data.exam_id, data.question_id]
        );
        return result.rows[0];
    },

    async remove(data: ExamQuestion): Promise<boolean> {
        const result = await query(
            `DELETE FROM question_exam WHERE exam_id = $1 AND question_id = $2`,
            [data.exam_id, data.question_id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}