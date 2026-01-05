import { JsonAnswer, JsonQuestion } from "./type";

export const FileParserModel = {
    // Hàm trích xuất các hình ảnh từ câu hỏi
    extractQuestionImages(question: JsonQuestion, imagesMap: Record<string, string>): string[] {
        const list: string[] = [];

        question.question.images?.forEach(img => {
            if (img.saved_path) {
                const filename = img.saved_path.split(/[/\\]/).pop();
                if (filename && imagesMap[filename]) {
                    list.push(imagesMap[filename]);
                }
            }
            else {
                list.push(img)
            }
        });

        return list;
    },

    // Hàm trích xuất các hình ảnh từ câu trả lời
    extractAnswerImages(answer: JsonAnswer, imagesMap: Record<string, string>): string[] {
        const list: string[] = [];

        answer.images?.forEach(img => {
            if (img.saved_path) {
                const filename = img.saved_path.split(/[/\\]/).pop();
                if (filename && imagesMap[filename]) {
                    list.push(imagesMap[filename]);
                }
            }
            else {
                list.push(img)
            }
        });

        return list;
    },

    // Hàm thu thập tên tất cả hình ảnh từ câu hỏi và câu trả lời
    collectImageNames(jsonData: (JsonQuestion | JsonAnswer)[]): string[] {
        const files = new Set<string>();

        jsonData.forEach(item => {
            // Nếu là JsonQuestion
            if ("question" in item && "answers" in item) {
                item.question.images?.forEach(img => {
                    const filename = img.saved_path.split(/[/\\]/).pop(); // lấy tên file
                    if (filename) files.add(filename);
                });

                item.answers.forEach(a => {
                    a.images?.forEach(img => {
                        const filename = img.saved_path.split(/[/\\]/).pop();
                        if (filename) files.add(filename);
                    });
                });
            }

            // Nếu là JsonAnswer
            else if ("images" in item) {
                item.images?.forEach(img => {
                    const filename = img.saved_path.split(/[/\\]/).pop();
                    if (filename) files.add(filename);
                });
            }
        });

        return Array.from(files);
    },
}