import type { Progress as ProgressOrigin } from "@prisma/client";

export const Progress: { [k in ProgressOrigin]: k } = {
  INPUT: "INPUT",
  WAITING: "WAITING",
  DONE: "DONE",
} as const;

export type Progress = ProgressOrigin;
