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
  subject_type: number;
  subject_name: string;
  contestant_count? : number;
  top3 : {
    user_id : number,
    user_name : string,
    time_test : number
  }[]
};

export interface DoExams {
  question_id: number;
  user_answer: (string | number)[];
};

export type ResultExams = {
  score: number
}

export type RankProp = {
  exam_id: number
}

export type Rank = {
  user_id: number;
  user_name: string;
  score: number;
  time_test: number;
  final_score: number;
}

export interface myRank {
  rank: number,
  score: number,
  time_test: number
}

export interface MyExam{
  exam_id: number,
  exam_name: string,
  subject_type: number,
  time_limit: number
}

