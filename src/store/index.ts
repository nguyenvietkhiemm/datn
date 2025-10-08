"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userReducer, logout } from "./slices/userSlices";

// Gộp tất cả reducers vào 1 root
const appReducer = combineReducers({
  user: userReducer,
});

// Tạo rootReducer có thể reset toàn bộ state khi logout
const rootReducer = (state: any, action: any) => {
  if (action.type === logout.type) {
    //Reset toàn bộ Redux state về initialState
    state = undefined;
  }
  return appReducer(state, action);
};

//Cấu hình store sử dụng rootReducer
export const store = configureStore({
  reducer: rootReducer,
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
