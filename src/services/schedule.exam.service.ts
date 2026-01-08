import { query } from "../config/database";
import { ScheduleExam } from "../models/schedule.exam.model";

export const ScheduleExamService = {
        //  Lấy danh sách tất cả lịch thi (có phân trang)
        async getAll(
                page?: number
        ): Promise<{
                schedules: ScheduleExam[];
                totalPages: number;
        }> {
                const isPaging = Number.isInteger(page) && page! > 0;
                const now = new Date();
                const limit = 10;
                const offset = isPaging ? (page! - 1) * limit : 0;

                const dataQuery = `
                        SELECT
                                es.exam_schedule_id,
                                es.start_time,
                                es.end_time,
                                es.created_at,
                                es.updated_at,
                                COUNT(e.exam_id) AS total_exams
                        FROM exam_schedule es
                        LEFT JOIN exam e
                                ON e.exam_schedule_id = es.exam_schedule_id
                        GROUP BY
                                es.exam_schedule_id,
                                es.start_time,
                                es.end_time,
                                es.created_at,
                                es.updated_at
                        ORDER BY
                                CASE
                                        WHEN es.start_time <= $3 AND es.end_time >= $3 THEN 1
                                        WHEN es.start_time > $3 THEN 2
                                        ELSE 3
                                END,
                                es.end_time
                ${isPaging ? "LIMIT $1 OFFSET $2" : ""}
                `;

                const params = isPaging ? [limit, offset, now] : [null, null, now];

                const dataResult = await query(dataQuery, params);

                const countQuery = `
                SELECT COUNT(*)::int AS total
                FROM exam_schedule
                `;
                const countResult = await query(countQuery);
                const totalRecords = countResult.rows[0].total;

                const totalPages = isPaging ? Math.ceil(totalRecords / limit) : 1;

                return {
                schedules: dataResult.rows as ScheduleExam[],
                totalPages,
                };
        },


        //  Lấy lịch thi theo ID + danh sách đề thi
        async getById(id: number): Promise<ScheduleExam | null> {
                const queryText = `
                SELECT e.exam_name, e.topic_id, e.time_limit, e.exam_id, e.created_at, t.title
                FROM exam_schedule s
                JOIN exam e ON s.exam_schedule_id = e.exam_schedule_id
                JOIN topic t ON t.topic_id = e.topic_id
                WHERE s.exam_schedule_id = $1 AND e.available =true`;
                const result = await query(queryText, [id]);

                // Lấy thông tin cơ bản của lịch thi (từ dòng đầu tiên)
                const scheduleQuery = await query(
                        `SELECT * FROM exam_schedule WHERE exam_schedule_id = $1`,
                        [id]
                );
                const schedule = scheduleQuery.rows[0];

                // Gắn danh sách exam vào
                const scheduleWithExams = {
                        ...schedule,
                        exams: result.rows.length > 0 ? result.rows : [], // danh sách các đề thi trong lịch này
                };

                return scheduleWithExams as ScheduleExam;
        },

        //  Tạo mới lịch thi
        async create(data: ScheduleExam): Promise<ScheduleExam> {
                const queryText = `
                INSERT INTO exam_schedule (start_time, end_time)
                VALUES ($1, $2)
                RETURNING *`;
                const result = await query(queryText, [
                        data.start_time,
                        data.end_time
                ]);
                return result.rows[0];
        },

        //  Cập nhật lịch thi
        async update(id: number, data: ScheduleExam): Promise<ScheduleExam | null> {
                const queryText = `
                UPDATE exam_schedule
                SET     
                start_time = $1, 
                end_time = $2
                WHERE exam_schedule_id = $3
                RETURNING *`;
                const result = await query(queryText, [
                        data.start_time,
                        data.end_time,
                        id
                ]);
                return result.rows[0] || null;
        },

        //  Xoá lịch thi
        async remove(id: number): Promise<boolean> {
                const result = await query(
                        "DELETE FROM exam_schedule WHERE exam_schedule_id = $1",
                        [id]
                );
                return (result.rowCount ?? 0) > 0;
        },
};


