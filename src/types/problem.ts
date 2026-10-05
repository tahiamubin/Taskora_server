export type ProblemFormData = {
  platform: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solutionLink: string;
  attempted: "yes" | "no";
  concepts: string;
  description: string;
};