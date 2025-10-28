import mongoose, { Schema, Document } from "mongoose";

export interface IRewardPointValues extends Document {
  LESSON_COMPLETED: number;
  QUIZ_QUESTION_CORRECT: number;
  QUIZ_QUESTION_WRONG: number;
  QUIZ_PERFECT_SCORE: number;
  PUZZLE_SOLVED: number;
  CODING_PROBLEM_SOLVED: number;
  CODING_PROBLEM_PERFECT: number;
  STREAK_DAY_BONUS: number;
  SUBJECT_ENROLLED: number;
  ACHIEVEMENT_EARNED: number;
  updatedAt: Date;
  createdAt: Date;
}

const rewardPointValuesSchema: Schema = new Schema(
  {
    LESSON_COMPLETED: { type: Number, required: true, default: 1 },
    QUIZ_QUESTION_CORRECT: { type: Number, required: true, default: 0.5 },
    QUIZ_QUESTION_WRONG: { type: Number, required: true, default: 0.1 },
    QUIZ_PERFECT_SCORE: { type: Number, required: true, default: 2 },
    PUZZLE_SOLVED: { type: Number, required: true, default: 1.5 },
    CODING_PROBLEM_SOLVED: { type: Number, required: true, default: 2.5 },
    CODING_PROBLEM_PERFECT: { type: Number, required: true, default: 4 },
    STREAK_DAY_BONUS: { type: Number, required: true, default: 0.5 },
    SUBJECT_ENROLLED: { type: Number, required: true, default: 0.5 },
    ACHIEVEMENT_EARNED: { type: Number, required: true, default: 5 },
  },
  { timestamps: true }
);

export const RewardPointValues = mongoose.model<IRewardPointValues>(
  "RewardPointValues",
  rewardPointValuesSchema
);
