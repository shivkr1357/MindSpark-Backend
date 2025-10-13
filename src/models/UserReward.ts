import mongoose, { Schema, Document } from "mongoose";

export interface IUserReward extends Document {
  userId: string;
  rewardId: string;
  earnedAt: Date;
  progress: number; // Progress towards repeatable rewards (0-100)
  timesEarned: number; // For repeatable rewards
  metadata?: {
    subjectId?: string;
    categoryId?: string;
    score?: number;
    accuracy?: number;
    streakDays?: number;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userRewardSchema = new Schema<IUserReward>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    rewardId: {
      type: String,
      required: true,
      index: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    timesEarned: {
      type: Number,
      default: 1,
      min: 1,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
userRewardSchema.index({ userId: 1, rewardId: 1 });
userRewardSchema.index({ userId: 1, earnedAt: -1 });
userRewardSchema.index({ userId: 1, "metadata.subjectId": 1 });

export const UserReward = mongoose.model<IUserReward>(
  "UserReward",
  userRewardSchema
);
