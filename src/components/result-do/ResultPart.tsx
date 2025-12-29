import styles from "./ResultPart.module.css";
import ResultMultipleChoice from "@/components/result-multiple-choice/page";
import ResultEssay from "@/components/result-essay/page";
import { PART_LABEL } from "../../../lib/model";
import { ReviewQuestion } from "../../../domain/question-answer/type";

interface Props {
  type: 1 | 2 | 3;
  questions?: ReviewQuestion[];
}

export default function ResultPart({ type, questions }: Props) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className={styles.part}>
      <h4 className={styles.partTitle}>{PART_LABEL[type]}</h4>

      {questions.map((q, index) =>
        type !== 3 ? (
          <ResultMultipleChoice
            key={q.question_id}
            q={q}
            index={index}
          />
        ) : (
          <ResultEssay
            key={q.question_id}
            q={q}
            index={index}
            userText={q.user_answers[0]?.answer_content ?? ""}
          />
        )
      )}
    </div>
  );
}
