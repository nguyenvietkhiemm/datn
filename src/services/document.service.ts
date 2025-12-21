import { query } from "../config/database";
import { Document } from "../models/document.model";
import pool from "../config/database";

const DocumentService = {
    async getAll(
        page: number = 1,
        status: string = "All",
        searchValue: string = "",
        topicIds: number | "All",
        subject_id: number | "All"
    ): Promise<{ data: Document[]; totalPages: number }> {

        const limit = 12;

        // sanitize page
        const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
        const offset = (safePage - 1) * limit;

        let conditions: string[] = [];
        let params: any[] = [];
        let idx = 1;

        // Search
        if (searchValue.trim() !== "") {
            conditions.push(`
            (
                unaccent(LOWER(d.title)) LIKE unaccent(LOWER($${idx}))
                OR unaccent(LOWER(t.title)) LIKE unaccent(LOWER($${idx}))
              )
        `);
            params.push(`%${searchValue}%`);
            idx++;
        }

        // Status
        if (status !== "All") {
            conditions.push(`d.available = $${idx}`);
            params.push(status);
            idx++;
        }

        // Topic filter
        if (topicIds !== "All") {
            conditions.push(`d.topic_id = ($${idx})`);
            params.push(topicIds);
            idx++;
        }

        //subject
        if (subject_id !== "All") {
            conditions.push(`sj.subject_id = ($${idx})`);
            params.push(subject_id);
            idx++;
        }

        const whereClause =
            conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        /* ===== MAIN QUERY ===== */
        const queryText = `
          SELECT
            d.document_id,
            d.title,
            d.link,
            d.topic_id,
            d.available,
            d.created_at,
            t.title AS topic_title
          FROM document d
          LEFT JOIN topic t ON d.topic_id = t.topic_id
          JOIN subject sj ON sj.subject_id = t.subject_id
          ${whereClause}
          ORDER BY d.document_id DESC
          LIMIT $${idx} OFFSET $${idx + 1}
        `;

        const result = await query(queryText, [...params, limit, offset]);

        /* ===== COUNT QUERY ===== */
        const countQuery = `
          SELECT COUNT(*)::int AS total
          FROM document d
          LEFT JOIN topic t ON d.topic_id = t.topic_id
          JOIN subject sj ON sj.subject_id = t.subject_id
          ${whereClause}
        `;

        const countResult = await query(countQuery, params);
        const totalItems = countResult.rows[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: result.rows,
            totalPages,
        };
    },

    async create(document: Document, fileLink: string): Promise<Document | null> {

        const result = await query(
            `INSERT INTO document (title, link, topic_id)
                 VALUES ($1, $2, $3)
                 RETURNING document_id, title, link, embedding, created_at, available, topic_id`,
            [document.title, fileLink, document.topic_id]
        );

        const newDocument: Document = result.rows[0];

        // await client.query(
        //     `INSERT INTO document_history (document_id) 
        //      VALUES ($1)`,
        //     [newDocument.document_id]
        // );

        return newDocument;
    },

    async update(id: number, document: Partial<Document>): Promise<Document> {
        if (!id) {
            throw new Error("document_id isn't exist");
        };

        // chỉ cho phép update title, link, topic_id
        const allowed = ["title", "link", "topic_id"];
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        for (const key of allowed) {
            const value = (document as any)[key];
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
        const result = await query(queryText, values);

        return result.rows[0]
    },

    async setAvailable(id: number, available: boolean): Promise<boolean> {
        const result = await query('UPDATE document SET available = $1 WHERE document_id = $2', [available, id]);
        return (result.rowCount ?? 0) > 0;
    },

    async remove(id: number): Promise<void> {
        await query('DELETE FROM document WHERE document_id = $1', [id]);
    },

}
export default DocumentService;