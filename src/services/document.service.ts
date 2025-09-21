import { get } from "http";
import { query } from "../config/database";
import { Document } from "../model/document.model";
import pool from "../config/database";

const DocumentService = {
    async get(document_ids: number[]): Promise<Document[]> {
        if (!document_ids || document_ids.length === 0) {
            return [];
        }

        const queryText = 'SELECT * FROM document WHERE document_id = ANY($1)';
        const result = await query(queryText, [document_ids]);

        return result.rows;
    },

    async getAll(limit: number = 100, offset: number = 0): Promise<Document[]> {
        const queryText = 'SELECT * FROM document ORDER BY document_id LIMIT $1 OFFSET $2';
        const result = await query(queryText, [limit, offset]);

        return result.rows;
    },
    
    async create(documents: Document[]): Promise<string> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const document of documents) {
                const result = await client.query(
                    'INSERT INTO document (title, link, embedding, created_at, topic_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [document.title, document.link, document.embedding, document.created_at, document.topic_id]
                );

                const newDocument: Document = result.rows[0];
                for (const document of documents) {
                    await client.query(
                        'INSERT INTO document_history (document_id, created_at) VALUES ($1, $2)',
                        [newDocument.document_id, document.created_at]
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
    },

    async update(document: Partial<Document>): Promise<Document> {
        const client = await pool.connect();
        try {
            const id = document.document_id;

            await client.query('BEGIN');

            const allowed = ["title", "link", "embedding", "created_at", "topic_id"];
            const fields: string[] = [];
            const values: any[] = [];
            let idx = 1;

            for (const key of allowed) {
                if ((document as any)[key] !== undefined) {
                    fields.push(`${key} = $${idx}`);
                    values.push((document as any)[key]);
                    idx++;
                }
            }

            let updatedDocument: Document | null = null;

            if (fields.length > 0) {
                values.push(id);
                const queryText = `UPDATE document SET ${fields.join(", ")} WHERE document_id = $${idx} RETURNING *`;
                const result = await client.query(queryText, values);
                updatedDocument = result.rows[0] || null;
            }
            const result = await query('UPDATE document SET title = $1, link = $2, embedding = $3, created_at = $4, topic_id = $5 WHERE document_id = $6 RETURNING *', 
                [document.title, document.link, document.embedding, document.created_at, document.topic_id, id]);
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async remove(document_id: number): Promise<boolean> {
        const result = await query('DELETE FROM document WHERE document_id = $1', [document_id]);
        return result.rowCount! > 0;
    },
    
}
export default DocumentService;