import pool, { query } from "../config/database";
import { Bank, DoBank } from "../models/bank.model";
import { Question } from "../models/question.model";

const BankService = {
    async getById(id: number): Promise<Question[] | null> {
        const queryText = `
          SELECT q.*
          FROM bank b
          JOIN question_bank qb ON b.bank_id = qb.bank_id
          JOIN question q ON qb.question_id = q.question_id
          WHERE b.bank_id = $1
        `;
        const result = await query(queryText, [id]);
        if (!result.rows.length) return null;

        // Lấy danh sách question_id
        const questionIds = result.rows.map(q => q.question_id);
        const ansRes = await query(
            'SELECT * FROM answer WHERE question_id = ANY($1)',
            [questionIds]
        );

        // Gom answer theo question_id
        const answerMap = ansRes.rows.reduce((acc, ans) => {
            (acc[ans.question_id] ||= []).push(ans);
            return acc;
        }, {} as Record<number, any[]>);

        // Gắn answers vào từng question
        const questions = result.rows.map(q => ({
            ...q,
            answers: answerMap[q.question_id] || []
        }));

        return questions as Question[];
    },

    async create(bank: Bank): Promise<Bank> {
        const queryText = `
            INSERT INTO bank (description, topic_id)
            VALUES ($1, $2) RETURNING *`;
        const result = await query(queryText, [bank.description, bank.topic_id]);
        return result.rows[0];
    },

    async update(id: number, data: Bank): Promise<Bank | null> {
        const queryTextBase = 'UPDATE bank SET description = $1, topic_id = $2 WHERE bank_id = $3 RETURNING *';
        const result = await query(queryTextBase, [data.description, data.topic_id, id]);
        return result.rows[0] || null;
    },

    async submit(bank_id: number, user_id: number, do_bank: DoBank[], subject_type: number):
        Promise<{ score: number, score_1: number, score_2: number, score_3: number }> {

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const sql = `
                SELECT 
                    q.question_id,
                    q.type_question,
                    a.answer_id,
                    a.answer_content,
                    a.is_correct
                FROM question_bank qb
                JOIN question q ON q.question_id = qb.question_id
                JOIN answer a ON a.question_id = q.question_id
                WHERE qb.bank_id = $1
                ORDER BY q.question_id;
                `;

            const { rows } = await client.query(sql, [bank_id]);

            // Gom dữ liệu thành dạng:
            // question_id → { type_question, correctAnswers[] }
            const map = new Map<number, {
                type_question: number;
                correct_answers: number[];
                correct_text?: string;
            }>();

            for (const r of rows) {
                if (!map.has(r.question_id)) {
                    map.set(r.question_id, {
                        type_question: r.type_question,
                        correct_answers: [],
                        correct_text: undefined
                    });
                }
                const current = map.get(r.question_id)!;

                if (r.is_correct && r.type_question !== 3) {
                    current.correct_answers.push(r.answer_id);

                }

                if (r.type_question === 3 && r.is_correct) {
                    current.correct_text = r.answer_content;
                }
            }

            //diem tong
            let score = 0;
            //diem tung phan
            let score_1 = 0;
            let score_2 = 0;
            let score_3 = 0;

            for (const user of do_bank) {
                const info = map.get(user.question_id);
                if (!info) continue;

                const { type_question, correct_answers } = info;

                // ==== Trắc nghiệm loai 1 đáp án ====
                if (type_question === 1) {
                    if (user.user_answer[0] == correct_answers[0]) {
                        score += 0.25
                    }
                    await client.query(`
                        INSERT INTO user_bank_answer (bank_id, user_id, answer_id)
                        VALUES ($1, $2, $3)
                    `, [bank_id, user_id, user.user_answer[0]]);
                }
                // ==== Trắc nghiệm loai nhiều đáp án ====
                else if (type_question === 2) {
                    const correct = user.user_answer.filter(a => correct_answers.includes(Number(a))).length;
                    if (correct === 1) {
                        score_2 += 0.1
                    } else if (correct === 2) {
                        score_2 += 0.25
                    } else if (correct === 3) {
                        score_2 += 0.5
                    } else score_2 += 1

                    for (const ansId of user.user_answer) {
                        if (!isNaN(Number(ansId))) {
                            await client.query(`
                                INSERT INTO user_bank_answer (bank_id, user_id, answer_id)
                                VALUES ($1, $2, $3)
                            `, [bank_id, user_id, ansId]);
                        }
                    }
                }
                // ==== Tự luận đáp án ====
                else {
                    const correct_text = correct_answers[0];
                    const user_text = user.user_answer[0];
                    if ((String(user_text).trim().toLowerCase() === String(correct_text).trim().toLowerCase())) {
                        if (subject_type === 1) {
                            score_3 += 0.5
                        } else {
                            score_3 += 0.25
                        }
                    }
                    await client.query(`
                        INSERT INTO user_bank_answer (bank_id, user_id, user_answer_text)
                        VALUES ($1, $2, $3)
                    `, [bank_id, user_id, user.user_answer[0]]);
                }
            }
            score = score_1 + score_2 + score_3

            //luu CAU tra loi


            await client.query("COMMIT");

            return { score, score_1, score_2, score_3 };

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    async setAvailable(id: number, available: boolean): Promise<boolean> {
        const result = await query(
            "UPDATE bank SET available = $1 WHERE bank_id = $2",
            [available, id]
        );
        return (result.rowCount ?? 0) > 0;
    },

    async remove(id: number): Promise<boolean> {
        const queryText = 'DELETE FROM bank WHERE bank_id = $1';
        const result = await query(queryText, [id]);
        return (result.rowCount ?? 0) > 0;
    },

    async list(page: number, searchValue: string, topicIds: number[]): Promise<({ banks: Bank[]; totalPages: number }) | []> {

        const limit = 12;
        const offset = (page - 1) * limit;

        let conditions = [];
        let params = [];
        let idx = 1;

        // dieu kien loc bai luyen tap 
        conditions.push(`b.available = true`);

        // Search
        if (searchValue.trim() !== "") {
            conditions.push(`(LOWER(b.description) LIKE LOWER($${idx}))`);
            params.push(`%${searchValue}%`);
            idx++;
        }

        // Topic filter
        if (topicIds.length > 0) {
            conditions.push(`b.topic_id = ANY($${idx})`);
            params.push(topicIds);
            idx++;
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const queryText = `
                SELECT 
                    b.*,
                    t.title
                FROM bank b
                JOIN topic t ON b.topic_id = t.topic_id
                ${whereClause}
                ORDER BY b.bank_id DESC
                LIMIT ${limit} OFFSET ${offset}
                `;

        const result = await query(queryText, params);

        // Count total
        const countQuery = `
                SELECT COUNT(*) AS total
                FROM bank b
                ${whereClause}
                `;

        const countResult = await query(countQuery, params);

        const totalPages = Math.ceil(countResult.rows[0].total / limit);

        return { banks: result.rows, totalPages };
    }
};

export default BankService;