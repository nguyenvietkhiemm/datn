import { Question, Answer } from "./type";

export const QuestionModel = {
    normalizeImages(img: string[] | string | undefined): string[] {
        if (!img) return [];
        if (Array.isArray(img)) return img;
    
        try {
            const parsed = JSON.parse(img);
    
            if (Array.isArray(parsed)) return parsed;
            if (typeof parsed === "string") return [parsed];
    
            return [];
        } catch {
            return [img];
        }
    },
}