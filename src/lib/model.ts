import { Question } from "@/domain/admin/questions/type";

export function formatVNDateTime(dateInput: string | number | Date): string {
    const date = new Date(dateInput);

    const pad = (n: number) => n.toString().padStart(2, "0");

    // Sử dụng các hàm getUTC để lấy đúng con số lưu trong DB
    const day = pad(date.getUTCDate());
    const month = pad(date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();

    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
};

export interface typeNoti {
    message: React.ReactNode;
    type: "success" | "error" | "warning" | "info" | "loading";
    confirm?: boolean;
    duration?: number
}

export const answerLabel = (index: number) => String.fromCharCode(65 + index);

export const TypeQuestion = [1, 2, 3] as const;
export type questionGroup = Record<number, Question[]>
export function FlatQuestions(questionGroup: questionGroup): Question[] {
    return TypeQuestion.flatMap(type => questionGroup?.[type] ?? []);
}
export const PART_LABEL: Record<number, string> = {
    1: "PHẦN I – Trắc nghiệm 4 đáp án",
    2: "PHẦN II – Đúng / Sai",
    3: "PHẦN III – Trả lời tự luận",
};
