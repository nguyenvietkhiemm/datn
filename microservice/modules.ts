import fs from "fs";
import path from "path";
import csv from "csv-parser";
import QuestionService from "../src/services/question.service";
import { Question } from "../src/model/question.model";

async function importQuestionsFromCSV(filePath: string, exam_id: number) {
  const questions: Partial<Question>[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.resolve(filePath))
      .pipe(csv({ headers: ["question", "answer"], skipLines: 1 }))
      .on("data", (row) => {
        try {
          const question_name = row.question?.trim();
          const question_content = "";
          const available = true;

          let answers: { answer_content: string; is_correct: boolean }[] = [];

          try {
            // Cố gắng parse dạng chuỗi ['A...', 'B...']
            let arr: string[] = [];
            try {
              arr = JSON.parse(row.answer.replace(/'/g, '"'));
            } catch {
              arr = eval(row.answer); // fallback nếu parse JSON thất bại
            }

            if (Array.isArray(arr)) {
              const splitAnswers = arr
                .join(" ")
                .split(/\t|\\t| {2,}/)
                .map((a: string) => a.trim())
                .filter((a: string) => a.length > 0);

              answers = splitAnswers.map((ans: string) => ({
                answer_content: ans,
                is_correct: false,
              }));
            }
          } catch (err) {
            console.error("⚠️ Lỗi parse answer:", row.answer, err);
          }

          // Push dữ liệu dạng Partial<Question>
          questions.push({
            question_name,
            question_content,
            available,
            answers: answers.map((a) => ({
              // ép kiểu sang Partial<Answer>
              answer_id: 0,
              question_id: 0,
              answer_content: a.answer_content,
              is_correct: a.is_correct,
            })),
          });
        } catch (err) {
          console.error("⚠️ Lỗi xử lý dòng CSV:", row, err);
        }
      })
      .on("end", async () => {
        try {
          // ép kiểu sang Question[] để tương thích với service
          const result = await QuestionService.create(
            questions as Question[],
            exam_id
          );

          console.log(
            `✅ Đã import ${result.length} câu hỏi vào đề thi ${exam_id}`
          );
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

// 🧪 Chạy thử
importQuestionsFromCSV("./data/final/all_questions_combined.csv", 1)
  .then(() => console.log("✅ Hoàn tất import."))
  .catch((err) => console.error("❌ Lỗi import:", err));
