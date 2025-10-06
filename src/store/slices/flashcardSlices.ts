"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type FlashcardState = {
    name : string | null
}

const initialState : FlashcardState = {
    name : null
}
const flashcardSlices = createSlice({
    name : "flashcard",
    initialState,
    reducers : {
        
    }
})