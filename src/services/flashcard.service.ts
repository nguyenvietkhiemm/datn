import { query } from "../config/database";
import { Flashcard } from "../model/flashcard.model";

// Flashcard Service
export const FlashcardService = {

  async add(data: Flashcard): Promise<Flashcard> {
    const result = await query(
      `INSERT INTO flashcard (front, back, example, status, flashcard_deck_id)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        data.front,
        data.back,
        data.example,
        data.status,
        data.flashcard_deck_id,
      ]
    );
    return result.rows[0];
  },

  async update(
    id: number,
    data: Partial<Flashcard>
  ): Promise<Flashcard | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, val] of Object.entries(data)) {
      fields.push(`${key} = $${idx}`);
      values.push(val);
      idx++;
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE flashcard SET ${fields.join(
        ", "
      )} WHERE flashcard_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async remove(id: number): Promise<boolean> {
    const result = await query(
      "DELETE FROM flashcard WHERE flashcard_id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },
};
