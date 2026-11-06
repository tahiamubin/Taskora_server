export interface InterviewPrep {
  title: string;
  company: string;
  targetDate: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  isDone: boolean;
  createdAt: Date;
}

export interface InterviewTopicDoc {
  _id?: string;
  planId: string;
  userId: string;
  topics: Topic[];
  createdAt: Date;
}
