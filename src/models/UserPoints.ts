import mongoose, { Schema, Document } from "mongoose";

export interface IUserPoints extends Document {
  userId: string;
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  currentStreak: number; // Days
  longestStreak: number; // Days
  lastActivityDate: Date;
  breakdown: {
    lessonsCompleted: number;
    quizzesCompleted: number;
    puzzlesSolved: number;
    codingProblems: number;
    achievements: number;
    bonuses: number;
  };
  rewardCounts: {
    badges: number;
    achievements: number;
    milestones: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userPointsSchema = new Schema<IUserPoints>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    pointsToNextLevel: {
      type: Number,
      default: 10,
    },
    tier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      default: "bronze",
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
    breakdown: {
      lessonsCompleted: {
        type: Number,
        default: 0,
      },
      quizzesCompleted: {
        type: Number,
        default: 0,
      },
      puzzlesSolved: {
        type: Number,
        default: 0,
      },
      codingProblems: {
        type: Number,
        default: 0,
      },
      achievements: {
        type: Number,
        default: 0,
      },
      bonuses: {
        type: Number,
        default: 0,
      },
    },
    rewardCounts: {
      badges: {
        type: Number,
        default: 0,
      },
      achievements: {
        type: Number,
        default: 0,
      },
      milestones: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userPointsSchema.index({ totalPoints: -1 }); // For leaderboards
userPointsSchema.index({ tier: 1, totalPoints: -1 });
userPointsSchema.index({ currentLevel: -1 });

// Pre-save middleware to update tier and level
userPointsSchema.pre("save", function (next) {
  // Calculate level (10 points per level base, scaling)
  const basePoints = 10;
  const scalingFactor = 1.2;
  let level = 1;
  let pointsNeeded = basePoints;
  let totalNeeded = 0;

  while (totalNeeded + pointsNeeded <= this.totalPoints) {
    totalNeeded += pointsNeeded;
    level++;
    pointsNeeded =
      Math.floor(basePoints * Math.pow(scalingFactor, level - 1) * 100) / 100; // Round to 2 decimals
  }

  this.currentLevel = level;
  this.pointsToNextLevel =
    Math.round((totalNeeded + pointsNeeded - this.totalPoints) * 100) / 100;

  // Determine tier based on level
  if (level >= 50) {
    this.tier = "diamond";
  } else if (level >= 30) {
    this.tier = "platinum";
  } else if (level >= 20) {
    this.tier = "gold";
  } else if (level >= 10) {
    this.tier = "silver";
  } else {
    this.tier = "bronze";
  }

  next();
});

export const UserPoints = mongoose.model<IUserPoints>(
  "UserPoints",
  userPointsSchema
);
