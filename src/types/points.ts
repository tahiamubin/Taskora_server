export interface PointEntry {
  _id: string;
  type: "problem" | "contest";
  points: number;
  reason: string;
  createdAt: Date;
}

export const LEVELS = [
  { name: "Diamond", min: 3000 },
  { name: "Platinum", min: 1500 },
  { name: "Gold", min: 600 },
  { name: "Silver", min: 200 },
  { name: "Bronze", min: 0 },
];