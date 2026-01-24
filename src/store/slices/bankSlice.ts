"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BankProps } from "../../../domain/bank/type";

type BankState = {
    banks : BankProps[]    
}

const initialState : BankState = {
    banks : []
}

const bankSlice = createSlice({
    name : "bank",
    initialState,
    reducers : {
        setBank(state, action : PayloadAction<BankProps[]>){
            state.banks = action.payload
        },

        clearBank: (state) => {
            state.banks = [];
        },
    }
})

export const {setBank, clearBank} = bankSlice.actions
export const bankReducer = bankSlice.reducer