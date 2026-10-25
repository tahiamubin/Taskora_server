export interface InterviewPrep {
  title: string;
  company: string;
  targetDate: string;
}

interface Topic {
  id: string;
  title: string;
  isDone: boolean;
  createdAt: Date;
}

interface InterviewTopicDoc {
  _id?: string;
  planId: string;
  userId: string;
  topics: Topic[];
  createdAt: Date;
}
