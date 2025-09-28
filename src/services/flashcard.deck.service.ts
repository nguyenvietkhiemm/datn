import { query } from "../config/database"
import { FlashcardDeck } from "../model/flashcard.deck.model";
import { Flashcard } from "../model/flashcard.model";

//Flashcard-deck Service
export const FlashcardDeckService = {
  async getAll(queryParams: any): Promise<FlashcardDeck[]> {
    const page = parseInt(queryParams.page as string, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT flashcard_deck_id, title, description, created_at
       FROM flashcard_deck
       ORDER BY flashcard_deck_id
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return result.rows;
  },

  async getById(id: number): Promise<Flashcard[] | null> {
    const result = await query(
      "SELECT * FROM flashcard WHERE flashcard_deck_id = $1",
      [id]
    );
    return result.rows || null;
  },

  async create(data: FlashcardDeck): Promise<FlashcardDeck> {
    const result = await query(
      `INSERT INTO flashcard_deck (title, description, user_id)
         VALUES ($1,$2,$3) RETURNING *`,
      [data.title, data.description, data.user_id]
    );
    return result.rows[0];
  },

  async update(id: number, data: Partial<Omit<FlashcardDeck, 'flashcard_deck_id' | 'created_at'>>): Promise<FlashcardDeck | null> {
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
      `UPDATE flashcard_deck SET ${fields.join(
        ", "
      )} WHERE flashcard_deck_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await query(
      "DELETE FROM flashcard_deck WHERE flashcard_deck_id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },
};
