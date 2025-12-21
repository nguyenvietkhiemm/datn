import { query } from "../config/database";
import { BankQuestion } from "../models/bank.question.model";


export const BankQuestionService = {
    async add(selectedQuestions: { bank_id: number; question_id: number }[]){
        const results = [];

        for (const b of selectedQuestions) {

            const res = await query(
                `INSERT INTO question_bank (bank_id, question_id)
                 VALUES ($1, $2)
                 RETURNING *`,
                [b.bank_id, b.question_id]
            );
            results.push(res.rows[0]);
        }

        return results;
    },

    async remove(data: BankQuestion): Promise<boolean> {
        const result = await query(
            `DELETE FROM question_bank WHERE bank_id = $1 AND question_id = $2`,
            [data.bank_id, data.question_id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}