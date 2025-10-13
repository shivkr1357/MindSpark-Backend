import mongoose, { Schema, Document } from "mongoose";

export interface IReward extends Document {
  name: string;
  description: string;
  type:
    | "badge"
    | "achievement"
    | "milestone"
    | "streak"
    | "completion"
    | "performance";
  category:
    | "learning"
    | "quiz"
    | "coding"
    | "puzzle"
    | "social"
    | "consistency"
    | "special";
  icon: string;
  color: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  criteria: {
    type:
      | "lessons_completed"
      | "quizzes_completed"
      | "correct_answers"
      | "streak_days"
      | "subjects_enrolled"
      | "accuracy_threshold"
      | "time_spent"
      | "puzzles_solved"
      | "coding_problems"
      | "perfect_score";
    target: number;
    subjectId?: string;
    categoryId?: string;
  };
  isActive: boolean;
  isRepeatable: boolean; // Can be earned multiple times
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema<IReward>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "badge",
        "achievement",
        "milestone",
        "streak",
        "completion",
        "performance",
      ],
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "learning",
        "quiz",
        "coding",
        "puzzle",
        "social",
        "consistency",
        "special",
      ],
      required: true,
      index: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    tier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      required: true,
      index: true,
    },
    criteria: {
      type: {
        type: String,
        enum: [
          "lessons_completed",
          "quizzes_completed",
          "correct_answers",
          "streak_days",
          "subjects_enrolled",
          "accuracy_threshold",
          "time_spent",
          "puzzles_solved",
          "coding_problems",
          "perfect_score",
        ],
        required: true,
      },
      target: {
        type: Number,
        required: true,
      },
      subjectId: String,
      categoryId: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isRepeatable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
rewardSchema.index({ type: 1, category: 1 });
rewardSchema.index({ tier: 1, isActive: 1 });
rewardSchema.index({ "criteria.type": 1 });

export const Reward = mongoose.model<IReward>("Reward", rewardSchema);
