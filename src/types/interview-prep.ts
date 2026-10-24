export interface InterviewPrep {
  title: string;
  company: string;
  targetDate: string;
}

interface Topic {
  id: ObjectId;
  title: string;
  isDone: boolean;
  createdAt: Date;
}

interface InterviewTopicDoc {
  _id?: ObjectId;
  planId: ObjectId;
  userId: string;
  topics: Topic[];
  createdAt: Date;
}
