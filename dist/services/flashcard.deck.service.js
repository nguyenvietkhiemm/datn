"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardDeckService = void 0;
const database_1 = require("../config/database");
//Flashcard-deck Service
exports.FlashcardDeckService = {
    async getAll(queryParams) {
        const page = parseInt(queryParams.page, 10) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const result = await (0, database_1.query)(`SELECT flashcard_deck_id, title, description, created_at
       FROM flashcard_deck
       ORDER BY flashcard_deck_id
       LIMIT $1 OFFSET $2`, [limit, offset]);
        return result.rows;
    },
    async getById(id) {
        const result = await (0, database_1.query)("SELECT * FROM flashcard WHERE flashcard_deck_id = $1", [id]);
        return result.rows || null;
    },
    async create(data) {
        const result = await (0, database_1.query)(`INSERT INTO flashcard_deck (title, description, user_id)
         VALUES ($1,$2,$3) RETURNING *`, [data.title, data.description, data.user_id]);
        return result.rows[0];
    },
    async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        for (const [key, val] of Object.entries(data)) {
            fields.push(`${key} = $${idx}`);
            values.push(val);
            idx++;
        }
        if (fields.length === 0)
            return null;
        values.push(id);
        const result = await (0, database_1.query)(`UPDATE flashcard_deck SET ${fields.join(", ")} WHERE flashcard_deck_id = $${idx} RETURNING *`, values);
        return result.rows[0] || null;
    },
    async delete(id) {
        const result = await (0, database_1.query)("DELETE FROM flashcard_deck WHERE flashcard_deck_id = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    },
};
