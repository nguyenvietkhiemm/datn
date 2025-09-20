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

    async getAll(limit: number = 100, offset: number = 0) {
        const queryText = `
          SELECT q.question_id, q.question_name, q.question_content,
                 COALESCE(
                   json_agg(
                     json_build_object(
                       'answer_id', a.answer_id,
                       'answer_content', a.answer_content,
                       'is_correct', a.is_correct
                     )
                   ) FILTER (WHERE a.answer_id IS NOT NULL), '[]'
                 ) AS answers
          FROM question q
          LEFT JOIN answer a ON q.question_id = a.question_id
          GROUP BY q.question_id
          ORDER BY q.question_id
          LIMIT $1 OFFSET $2;
        `;

        const result = await query(queryText, [limit, offset]);
        return result.rows;
    },


    async create(questions: Question[]): Promise<Question[]> {
        const client = await pool.connect();
        const createdQuestions: Question[] = [];
        try {
            await client.query('BEGIN');

            for (const qa of questions) {
                // insert question
                const qRes = await client.query(
                    `INSERT INTO question (question_name, question_content) 
               VALUES ($1, $2) RETURNING *`,
                    [qa.question_name, qa.question_content]
                );

                const newQuestion: Question = qRes.rows[0];
                newQuestion.answers = [];

                // insert answers
                if (qa.answers && qa.answers.length > 0) {
                    for (const ans of qa.answers) {
                        const aRes = await client.query(
                            `INSERT INTO answer (question_id, answer_content, is_correct) 
                   VALUES ($1, $2, $3) RETURNING *`,
                            [newQuestion.question_id, ans.answer_content, ans.is_correct]
                        );

                        const newAnswer: Answer = aRes.rows[0];
                        newQuestion.answers.push(newAnswer);
                    }
                }

                createdQuestions.push(newQuestion);
            }

            await client.query('COMMIT');
            return createdQuestions;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async update(id: number, question: Partial<Question>): Promise<Question | null> {
        const allowed = ["question_name", "question_content"];
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        for (const key in question) {
            if (!allowed.includes(key)) continue;
            fields.push(`${key} = $${idx}`);
            values.push((question as any)[key]);
            idx++;
        }

        if (fields.length === 0) return null;

        values.push(id);
        const queryText = `UPDATE question SET ${fields.join(', ')} WHERE question_id = $${idx} RETURNING *`;
        const result = await query(queryText, values);

        return result.rows[0] || null;
    },

};

export default QuestionService;
