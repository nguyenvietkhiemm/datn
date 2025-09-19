import { query } from "../config/database";
import pool from "../config/database";
import { Question } from "../model/question.model";
import { Answer } from "../model/answer.model";
import { DefaultResponse } from "../utils/safe.excute";

const QuestionService = {
    async get(question_ids: number[]): Promise<Question[]> {
        if (!question_ids || question_ids.length === 0) {
            return [];
        }

        const queryText = 'SELECT * FROM question WHERE question_id = ANY($1)';
        const result = await query(queryText, [question_ids]);

        return result.rows;
    },

    async getAll(limit: number = 100, offset: number = 0): Promise<Question[]> {
        const queryText = 'SELECT * FROM question ORDER BY question_id LIMIT $1 OFFSET $2';
        const result = await query(queryText, [limit, offset]);
    
        return result.rows;
    },
    
    async create(questions: {question: Question, answers: Answer[]}[]): Promise<string> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const qa of questions) {
                const qRes = await client.query(
                    `INSERT INTO question (question_name, question_content) 
                    VALUES ($1, $2) RETURNING *`,
                    [qa.question.question_name, qa.question.question_content]
                );

                const newQuestion = qRes.rows[0];
                for (const ans of qa.answers) {
                    await client.query(
                        `INSERT INTO answer (question_id, answer_content, is_correct) 
                        VALUES ($1, $2, $3)`,
                        [newQuestion.question_id, ans.answer_content, ans.is_correct]
                    );
                }
            }

            await client.query('COMMIT');
            return "COMMIT";
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }


};

export default QuestionService;
