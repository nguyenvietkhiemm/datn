"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardService = void 0;
const database_1 = require("../config/database");
// Flashcard Service
exports.FlashcardService = {
    async add(data) {
        const result = await (0, database_1.query)(`INSERT INTO flashcard (front, back, example, status, flashcard_deck_id)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`, [
            data.front,
            data.back,
            data.example,
            data.status,
            data.flashcard_deck_id,
        ]);
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
        const result = await (0, database_1.query)(`UPDATE flashcard SET ${fields.join(", ")} WHERE flashcard_id = $${idx} RETURNING *`, values);
        return result.rows[0] || null;
    },
    async delete(id) {
        const result = await (0, database_1.query)("DELETE FROM flashcard WHERE flashcard_id = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    },
};
