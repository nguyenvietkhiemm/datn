import pool, { query } from "../config/database";
import { Bank, DoBank } from "../models/bank.model";
import { Question } from "../models/question.model";
import { UserAnswerGrouped, AnswerCorrectGrouped } from "../models/bank.question.model";
const BankService = {
    async getById(bankId: number): Promise<Question[] | null> {
        const queryText = `
          SELECT
            q.*,
      
            -- images của question
            COALESCE(
              (
                SELECT json_agg(iq.image_link)
                FROM image_question iq
                WHERE iq.question_id = q.question_id
              ),
              '[]'
            ) AS images,
      
            -- answers
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'answer_id', a.answer_id,
                    'question_id', a.question_id,
                    'answer_content', a.answer_content,
                    'is_correct', a.is_correct,
      
                    -- image của answer
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
      
          FROM bank b
          JOIN question_bank qb ON b.bank_id = qb.bank_id
          JOIN question q ON qb.question_id = q.question_id
          WHERE b.bank_id = $1
          ORDER BY qb.question_id ASC
        `;

        const result = await query(queryText, [bankId]);

        if (!result.rows.length) return null;

        return result.rows as Question[];
    },

    async listBank(
        page: number,
        status: string,
        searchValue: string,
        topicIds: number | "All",
        subject_id: number | "All"
    ): Promise<{ banks: Bank[]; totalPages: number }> {

        const limit = 12;
        const offset = (page - 1) * limit;

        const conditions: string[] = [];
        const params: any[] = [];
        let idx = 1;

        // Search (bank description + topic title)
        if (searchValue.trim()) {
            conditions.push(`
            (
              unaccent(lower(b.description)) LIKE unaccent(lower($${idx}))
              OR
              unaccent(lower(t.title)) LIKE unaccent(lower($${idx}))
            )
          `);
            params.push(`%${searchValue}%`);
            idx++;
        }

        // Status
        if (status !== "All") {
            conditions.push(`b.available = $${idx}`);
            params.push(status === "true");
            idx++;
        }

        // Topic (CHỈ 1 topic)
        if (topicIds !== "All") {
            conditions.push(`b.topic_id = $${idx}`);
            params.push(topicIds);
            idx++;
        }

        // Subject
        if (subject_id !== "All") {
            conditions.push(`sj.subject_id = $${idx}`);
            params.push(subject_id);
            idx++;
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        // Query data
        const dataQuery = `
          SELECT
            b.bank_id,
            b.description,
            b.topic_id,
            b.available,
            t.title AS topic_name
          FROM bank b
          JOIN topic t ON b.topic_id = t.topic_id
          JOIN subject sj ON sj.subject_id = t.subject_id
          ${whereClause}
          ORDER BY b.bank_id DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

        // Count
        const countQuery = `
          SELECT COUNT(*) AS total
          FROM bank b
          JOIN topic t ON b.topic_id = t.topic_id
          JOIN subject sj ON sj.subject_id = t.subject_id
          ${whereClause}
        `;

        const [dataResult, countResult] = await Promise.all([
            query(dataQuery, params),
            query(countQuery, params),
        ]);

        return {
            banks: dataResult.rows,
            totalPages: Math.ceil(Number(countResult.rows[0].total) / limit),
        };
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

    async submit(
        bank_id: number,
        user_id: number,
        do_bank: DoBank[],
        time_test: number,
        subject_type: number,
        user_name: string
    ): Promise<{ score: number; history_bank_id: number }> {
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
                [bank_id]
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
            for (const user of do_bank) {
                const info = map.get(user.question_id);
                if (!info) continue;

                if (info.type_question === 1 &&
                    user.user_answer[0] == info.correct_answers[0]) {
                    score += 0.25;
                }
                else if (info.type_question === 2) {
                    const correct = user.user_answer.filter(
                        a => info.correct_answers.includes(Number(a))).length;
                    if (correct === 1) { score += 0.1 }
                    else if (correct === 2) { score += 0.25 }
                    else if (correct === 3) { score += 0.5 }
                    else score += 1;
                }
                if (info.type_question === 3 &&
                    String(user.user_answer[0]).trim().toLowerCase() ===
                    String(info.correct_text).trim().toLowerCase()) {
                    score += subject_type === 1 ? 0.5 : 0.25;
                }
            }

            // Insert history_exam (SAU khi có score)
            const historyResult = await client.query(
                `
            INSERT INTO history_bank (user_id, bank_id, score, time_test)
            VALUES ($1, $2, $3, $4)
            RETURNING history_bank_id
            `,
                [user_id, bank_id, score, time_test]
            );

            const history_bank_id = historyResult.rows[0].history_bank_id;

            // Insert user_exam_answer
            for (const user of do_bank) {
                for (const ans of user.user_answer) {
                    await client.query(
                        `
                INSERT INTO user_bank_answer
                (history_bank_id, bank_id, user_id, question_id, answer_id, user_answer_text)
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                        [
                            history_bank_id,
                            bank_id,
                            user_id,
                            user.question_id,
                            Number(ans),
                            isNaN(Number(ans)) ? ans : null
                        ]
                    );
                }
            }

            await client.query("COMMIT");
            return { score, history_bank_id };

        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async getUserListBankHistory(
        bank_id: number
    ): Promise<{
        bank_id: number;
        history: {
            score: number;
            time_test: number;
            created_at: Date;
        }[];
    }> {
        try {
            const listQuery =
                `SELECT hb.score, hb.time_test, hb.created_at, u.user_name
                    FROM history_bank hb
                    JOIN "user" u ON u.user_id = hb.user_id
                    WHERE bank_id=$1
                    ORDER BY history_bank_id DESC`
            const list = await query(listQuery, [bank_id])
            if (!list || list.rows.length === 0) {
                return {
                    bank_id,
                    history: []
                };
            }

            return {
                bank_id,
                history: list.rows
            };

        } catch (err) {
            console.error("Lỗi lấy lịch sử làm bài:", err);
            throw new Error("Không thể lấy lịch sử làm bài");
        }
    },

    async getUserAnswer(
        history_bank_id: number,
        bank_id: number
    ): Promise<{
        user_answer: UserAnswerGrouped[];
        score: number | null;
        answer_correct: AnswerCorrectGrouped[];
    }> {

        /* ===== ĐÁP ÁN ĐÚNG (GROUP BY question_id + question_content) ===== */
        const correctSql = `
          SELECT
            q.question_id,
            q.question_content,
            q.type_question,
            json_agg(
              json_build_object(
                'answer_id', a.answer_id,
                'answer_content', a.answer_content
              )
            ) AS correct_answers
          FROM bank b
          JOIN question_bank qb ON b.bank_id = qb.bank_id
          JOIN question q ON qb.question_id = q.question_id
          JOIN answer a ON q.question_id = a.question_id
          WHERE b.bank_id = $1
            AND a.is_correct = true
          GROUP BY q.question_id, q.question_content
          ORDER BY q.question_id;
        `;

        const correctResult = await pool.query(correctSql, [bank_id]);

        /* ===== ĐÁP ÁN USER ===== */
        const userSql = `
          SELECT question_id, answer_id, user_answer_text
          FROM user_bank_answer
          WHERE history_bank_id = $1
          ORDER BY question_id;
        `;

        const userResult = await pool.query(userSql, [history_bank_id]);

        const userMap = new Map<number, UserAnswerGrouped>();

        for (const row of userResult.rows) {
            const { question_id, answer_id, user_answer_text } = row;

            if (!userMap.has(question_id)) {
                userMap.set(question_id, {
                    question_id,
                    answer_id: [],
                    user_answer_text: null
                });
            }

            const item = userMap.get(question_id)!;

            if (answer_id !== null) {
                item.answer_id.push(answer_id);
            }

            if (user_answer_text !== null) {
                item.user_answer_text = user_answer_text;
            }
        }

        /* ===== SCORE ===== */
        const scoreResult = await pool.query(
            `SELECT score FROM history_bank WHERE history_bank_id = $1`,
            [history_bank_id]
        );

        const score = scoreResult.rows[0]?.score ?? null;

        return {
            user_answer: Array.from(userMap.values()),
            score,
            answer_correct: correctResult.rows
        };
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