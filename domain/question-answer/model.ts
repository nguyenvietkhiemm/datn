export type Answer = {
    answer_id: number;
    answer_content: string;
    is_correct: boolean;
  };
  
export type Question = {
    question_id: number;
    question_name: string;
    question_content: string;
    answers: Answer[];
  };