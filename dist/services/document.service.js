"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const database_2 = __importDefault(require("../config/database"));
const DocumentService = {
    // async get(document_ids: number[]): Promise<Document[]> {
    //     if (!document_ids || document_ids.length === 0) {
    //         return [];
    //     }
    //     const queryText = 'SELECT * FROM document WHERE document_id = ANY($1)';
    //     const result = await query(queryText, [document_ids]);
    //     return result.rows;
    // },
    async getAll(limit = 100, offset = 0) {
        const queryText = 'SELECT * FROM document ORDER BY document_id LIMIT $1 OFFSET $2';
        const result = await (0, database_1.query)(queryText, [limit, offset]);
        return result.rows;
    },
    async create(document) {
        const client = await database_2.default.connect();
        try {
            await client.query("BEGIN");
            const result = await client.query(`INSERT INTO document (title, link, topic_id) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`, [document.title, document.link, document.topic_id]);
            const newDocument = result.rows[0];
            await client.query(`INSERT INTO document_history (document_id) 
                 VALUES ($1)`, [newDocument.document_id]);
            await client.query("COMMIT");
            return newDocument;
        }
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    },
    async update(id, document) {
        const client = await database_2.default.connect();
        try {
            if (!id) {
                throw new Error("document_id isn't exist");
            }
            await client.query("BEGIN");
            // chỉ cho phép update title, link, topic_id
            const allowed = ["title", "link", "topic_id"];
            const fields = [];
            const values = [];
            let idx = 1;
            for (const key of allowed) {
                const value = document[key];
                if (value !== undefined) {
                    fields.push(`${key} = $${idx}`);
                    values.push(value);
                    idx++;
                }
            }
            if (fields.length === 0) {
                throw new Error("No valid fields provided for update");
            }
            values.push(id);
            const queryText = `
                UPDATE document 
                SET ${fields.join(", ")} 
                WHERE document_id = $${idx} 
                RETURNING *`;
            const result = await client.query(queryText, values);
            await client.query("COMMIT");
            return result.rows[0];
        }
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    },
    async setAvailable(id, available) {
        const result = await (0, database_1.query)('UPDATE document SET available = $1 WHERE document_id = $2', [available, id]);
        return (result.rowCount ?? 0) > 0;
    },
    async remove(id) {
        const client = await database_2.default.connect();
        try {
            await client.query('BEGIN');
            // Xóa document 
            await client.query('DELETE FROM document WHERE document_id = $1', [id]);
            await client.query('COMMIT');
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    },
};
exports.default = DocumentService;
