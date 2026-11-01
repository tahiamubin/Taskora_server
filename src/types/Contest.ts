export interface ContestFormData {
  _id?: string;
  userId: string;
  contestDate: string;
  description: string;
  name: string;
  platform: string;
  problemSolved: number;
  solutionLink: string;
  rank?: number;
  totalParticipants?: number;
}