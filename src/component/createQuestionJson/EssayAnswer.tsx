import { AnswerForm } from "@/domain/admin/questions/type";

type EssayAnswerProps = {
  answers: AnswerForm[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerForm[]>>;
};

export default function EssayAnswer({ answers, setAnswers }: EssayAnswerProps) {
  return (
    <div>
      <label style={{ fontWeight: 500 }}>Đáp án tự luận (tham khảo)</label>
      <textarea
        rows={4}
        placeholder="Nhập đáp án mẫu hoặc hướng dẫn chấm..."
        value={answers[0]?.answer_content || ""}
        onChange={(e) =>
          setAnswers([
            { answer_content: e.target.value, is_correct: true },
          ])
        }
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
        }}
      />
    </div>
  );
}
