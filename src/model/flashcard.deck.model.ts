// flashcard-deck.model.ts
export interface FlashcardDeck {
    flashcard_deck_id: number;
    title: string;
    description?: string | null;
    created_at: Date;
    user_id?: number | null;
  }