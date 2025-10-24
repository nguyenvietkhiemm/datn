"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const TopicService = {
    // Lấy toàn bộ tiêu đề
    async getAll() {
        const result = await (0, database_1.query)(`SELECT * FROM topic ORDER BY topic_id`);
        return result.rows;
    },
    async create(topic) {
        const result = await (0, database_1.query)(`INSERT INTO topic (title, description, subject_id)
             VALUES ($1, $2, $3) RETURNING *`, [topic.title, topic.description || null, topic.subject_id || null]);
        return result.rows[0];
    },
    async update(id, topic) {
        const result = await (0, database_1.query)(`UPDATE topic
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 subject_id = COALESCE($3, subject_id)
             WHERE topic_id = $4
             RETURNING *`, [topic.title, topic.description, topic.subject_id, id]);
        if (!result.rows[0])
            throw new Error('TOPIC_NOT_FOUND');
        return result.rows[0];
    },
    async remove(id) {
        const result = await (0, database_1.query)(`DELETE FROM topic WHERE topic_id = $1`, [id]);
        if (result.rowCount === 0)
            throw new Error('TOPIC_NOT_FOUND');
    },
};
exports.default = TopicService;
