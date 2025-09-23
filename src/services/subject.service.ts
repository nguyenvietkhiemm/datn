import pool, { query } from "../config/database";
import { Subject } from "../model/subject.model";

const SubjectService = {
    async getAll(limit: number = 100, offset: number = 0): Promise<Subject[]> {
        const queryText = 'SELECT * FROM subject ORDER BY subject_id LIMIT $1 OFFSET $2';
        const result = await query(queryText, [limit, offset]);

        return result.rows;
    },

    async create(subject: Subject): Promise<Subject> {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            const result = await client.query('INSERT INTO subject (subject_name) VALUES ($1) RETURNING *', [subject.subject_name]);
            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async update(subject: Subject): Promise<Subject> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await client.query('UPDATE subject SET subject_name = $1 WHERE subject_id = $2 RETURNING *', [subject.subject_name, subject.subject_id]);
            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async setAvailable(subject_id: number, available: boolean): Promise<boolean> {
        const result = await query('UPDATE subject SET available = $1 WHERE subject_id = $2', [available, subject_id]);
        return (result.rowCount ?? 0) > 0;
    },

    async remove(subject_id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Xóa  subject
            await client.query('DELETE FROM subject WHERE subject_id = $1', [subject_id]);
            
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}

export default SubjectService;