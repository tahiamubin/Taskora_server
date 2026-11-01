export interface PointEntry {
  userId: string;
  type: "problem" | "contest";
  refId: string; // the link, so the same link gives points only once
  points: number;
  reason: string;
  createdAt: Date;
}