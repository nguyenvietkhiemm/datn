"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exam } from "../../../domain/exam/type";

type ExamState = {
  exams: Exam[];
};

const initialState: ExamState = {
  exams: [],
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    // Lưu (ghi đè) toàn bộ danh sách
    setExams: (state, action: PayloadAction<Exam[]>) => {
      state.exams = action.payload;
    },

    // Thêm một exam mới vào danh sách
    addExam: (state, action: PayloadAction<Exam>) => {
      state.exams.push(action.payload);
    },

    // Xoá toàn bộ exam
    clearExams: (state) => {
      state.exams = [];
    },
  },
});

export const { setExams, addExam, clearExams } = examSlice.actions;
export const examReducer = examSlice.reducer;
