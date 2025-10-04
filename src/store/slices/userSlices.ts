import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
    name : string | null;
    email : string | null;
    isLoggedIn : boolean
}

const initialState : UserState = {
    name : null,
    email : null,
    isLoggedIn : false
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        login : (state, action : PayloadAction<{name : string; email : string}>) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isLoggedIn = true
        },
        logout: (state) => {
            state.name = null;
            state.email = null;
            state.isLoggedIn = false;
          },
    }
})

export const {login, logout} = userSlice.actions;
export const userReducer = userSlice.reducer;