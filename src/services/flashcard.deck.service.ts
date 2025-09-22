import {query} from "../config/database"
import { FlashcardDeck } from "../model/flashcard.deck.model";

//Flashcard-deck Service
export const FlashcardDeckService = {
  async getAll(): Promise<FlashcardDeck[]> {
    console.log("logic");
    const result = await query(
      "SELECT title, description, created_at FROM flashcard_deck ORDER BY flashcard_deck_id"
    );
    return result.rows;
  },

  async getById(id: number): Promise<FlashcardDeck | null> {
    const result = await query(
      "SELECT * FROM flashcard_deck WHERE flashcard_deck_id = $1",
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data: FlashcardDeck): Promise<FlashcardDeck> {
    const result = await query(
      `INSERT INTO flashcard_deck (title, description, created_at, user_id)
         VALUES ($1,$2,$3,$4) RETURNING *`,
      [data.title, data.description, data.created_at, data.user_id]
    );
    return result.rows[0];
  },

  async update(
    id: number,
    data: Partial<Omit<FlashcardDeck, 'flashcard_deck_id' | 'created_at'>>
  ): Promise<FlashcardDeck | null> {
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
