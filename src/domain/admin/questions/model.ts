import { JsonQuestion } from "../file/file-parser/type";
import { useState, useEffect } from "react";
import { FileParserService } from "../file/file-parser/service";

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

    async buildPayload(row: JsonQuestion) {
        return {
            question_content: row.question.text,
            available: true,
            source: row.question.label,
            type_question: row.question.type_question,
            images: Array.isArray(row.question.images)
                ? row.question.images.filter(
                    (img): img is string => typeof img === "string"
                )
                : [],
            answers: row.answers.map(a => ({
                answer_content: a.text,
                is_correct: a.is_correct,
                images: Array.isArray(a.images)
                    ? a.images.filter(
                        (img): img is string => typeof img === "string"
                    )
                    : [],
            })),
        };
    },
}