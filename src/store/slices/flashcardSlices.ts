"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Kiểu dữ liệu của flashcard
type Flashcard = {
  id: number;
  question: string;
  answer: string;
  created_at: Date;
};

// Kiểu dữ liệu của deck
type FlashcardDeck = {
  flashcard_deck_id: number;
  title: string;
  description: string;
  created_at: Date;
  cards: Flashcard[]; 
};

//  State tổng thể
type FlashcardState = {
  decks: FlashcardDeck[];
};

const initialState: FlashcardState = {
  decks: [],
};

const flashcardSlice = createSlice({
  name: "flashcard",
  initialState,
  reducers: {
    //  Lấy danh sách deck từ API
    getListDeck: (state, action: PayloadAction<FlashcardDeck[]>) => {
      state.decks = action.payload;
    },

  },
});


export const {
  getListDeck,
} = flashcardSlice.actions;

export const flashcardReducer = flashcardSlice.reducer;
