import { query } from "../config/database";
import pool from "../config/database";
import { Question } from "../model/question.model";
import { Answer } from "../model/answer.model";
import { DefaultResponse } from "../utils/safe.excute";

const QuestionService = {
        async get(
                question_id: number,
                count: number): Promise<Question[]> {
                const result = await query('SELECT * FROM question WHERE question_id = $1 LIMIT $2', [question_id, count]);

                return result.rows;
        };

        async create(question: Question, answers: Answer[]): Promise<string> {
                const client = await pool.connect(); // lấy client từ pool
                try {
                // transaction
                    await client.query('BEGIN');
            
                    const questionResult = await client.query(
                        `INSERT INTO question (question_name, question_content) 
                         VALUES ($1, $2, NOW()) RETURNING *`,
                        [question.question_name, question.question_content]
                    );
            
                    const newQuestion: Question = questionResult.rows[0];
            
                    for (const answer of answers) {
                        await client.query(
                            `INSERT INTO answer (question_id, answer_content, is_correct) 
                             VALUES ($1, $2, $3)`,
                            [newQuestion.question_id, answer.answer_content, answer.is_correct]
                        );
                    }
            
                    await client.query('COMMIT');
                    return "COMMIT";
            
                } catch (error) {
                    await client.query('ROLLBACK');
                    throw error;
                } finally {
                    client.release();
                }
            }
            
};

export default QuestionService;
