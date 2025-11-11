import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { Question } from "../model/question.model";
import { Answer } from "../model/answer.model";

export async function parseQuestionsFromCSV(filePath: string): Promise<Question[]> {
  const questions: Question[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(filePath))
      .pipe(csv({ headers: ["question", "answer"], skipLines: 1 }))
      .on("data", (row) => {
        try {
          const question_name = row.question?.trim() || "";
          const question_content = "";
          const available = true;

          let answers: Answer[] = [];

          try {
            let arr: string[] = [];

            // Cố gắng parse chuỗi dạng ['A...', 'B...'] hoặc ["A...", "B..."]
            try {
              arr = JSON.parse(row.answer.replace(/'/g, '"'));
            } catch {
              arr = eval(row.answer); // fallback nếu JSON.parse thất bại
            }

            if (Array.isArray(arr)) {
              const splitAnswers = arr
                .join(" ")
                .split(/\t|\\t| {2,}/)
                .map((a) => a.trim())
                .filter((a) => a.length > 0);

              answers = splitAnswers.map(
                (ans): Answer => ({
                  answer_id: 0,
                  question_id: 0,
                  answer_content: ans,
                  is_correct: false,
                })
              );
            }
          } catch (err) {
            console.error("⚠️ Lỗi parse answer:", row.answer, err);
          }

          questions.push({
            question_id: 0,
            question_name,
            question_content,
            available,
            answers,
          });
        } catch (err) {
          console.error("⚠️ Lỗi xử lý dòng CSV:", row, err);
        }
      })
      .on("end", () => resolve(questions))
      .on("error", reject);
  });
}
