import { number } from "framer-motion";

export type Exam = {
  exam_id: number;
  exam_name: string;
  time_limit: number;
  topic_id: number;
  exam_schedule_id?: number;
  start_time?: string;
  end_time?: string;
  description?: string;
  topic_name?: string;
  subject_type: number
};

export interface DoExams {
  question_id : number;
  user_answer : (string | number)[];
};

export type ResultExams = {
  score : number
}

export type RankProp = {
  exam_id : number
}

export type Rank = {
  user_id : number,
  final_score : number
}

export interface myRank {
  rank : number,
  final_score : number
}