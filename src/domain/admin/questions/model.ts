import { Question, Answer } from "./type";
import { FileParserModel } from "../file/file-parser/model";
import { JsonAnswer, JsonQuestion } from "../file/file-parser/type";
import { QuestionService } from "./service";
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

    async buildAnswers(
        answers: JsonAnswer[],
        images: Record<string, string>
    ) {
        return Promise.all(
            answers.map(async (a) => {
                // Ảnh cũ
                const oldImages =
                    FileParserModel.extractAnswerImages(a, images) || [];

                // Ảnh mới
                let newImageLinks: string[] = [];
                if (a.newImages?.length) {
                    newImageLinks =
                        await QuestionService.uploadQuestionImages(a.newImages);
                }

                const finalImages = [...oldImages, ...newImageLinks];

                return {
                    answer_content: a.text,
                    is_correct: a.is_correct,
                    images: finalImages.length ? finalImages : undefined,
                };
            })
        );
    },

    async buildPayload(
        row: JsonQuestion,
        images: Record<string, string>
    ) {
        const oldImages =
            FileParserModel.extractQuestionImages(row, images) || [];

        let newImageLinks: string[] = [];
        if (row.question.newImages?.length) {
            newImageLinks =
                await QuestionService.uploadQuestionImages(
                    row.question.newImages
                );
        }

        const finalImages = [...oldImages, ...newImageLinks];

        // ===== ANSWERS =====
        const answers =
            row.question.type_question === 3
                ? []
                : await this.buildAnswers(
                    row.answers,
                    images
                );

        return {
            question_content: row.question.text,
            available: true,
            source: row.question.label ?? "json",
            type_question: row.question.type_question,
            images: finalImages,
            answers,
        };
    }
}