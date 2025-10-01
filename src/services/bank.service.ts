import pool, { query } from "../config/database";
import { Bank } from "../model/bank.model";

const BankService = {
    async getAll(limit: number = 100, offset: number = 0): Promise<Bank[]> {
        const queryText = 'SELECT * FROM bank ORDER BY bank_id LIMIT $1 OFFSET $2';
        const result = await query(queryText, [limit, offset]);
        return result.rows;
    },

    async getById(id: number): Promise<Bank[] | null> {
        const queryText = 'SELECT * FROM bank WHERE bank_id = $1';
        const result = await query(queryText, [id]);
        return result.rows || null;
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
    }
};

export default BankService;