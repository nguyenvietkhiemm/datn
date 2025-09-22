// flashcard-status.type.ts
export type FlashcardStatus = "pending" | "done" | "miss";

// flashcard.model.ts
export interface Flashcard {
  flashcard_id: number;
  front: string;
  back?: string | null;
  example?: string | null;
  created_at: Date;
  status: FlashcardStatus;
  flashcard_deck_id?: number | null;
}

// flashcard-deck.model.ts
export interface FlashcardDeck {
  flashcard_deck_id: number;
  title: string;
  description?: string | null;
  created_at: Date;
  user_id?: number | null;
}
