import mongoose, { Schema, Document } from "mongoose";

export interface IUserPuzzleAttempt extends Document {
  _id: string;
  userId: string;
  puzzleId: string;
  solution: string;
  status: "solved" | "attempted" | "failed";
  timeSpent: number; // in minutes
  hintsUsed: number;
  points: number;
  solvedAt?: Date;
  attemptNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const userPuzzleAttemptSchema = new Schema<IUserPuzzleAttempt>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    puzzleId: {
      type: String,
      required: true,
      ref: "Puzzle",
    },
    solution: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["solved", "attempted", "failed"],
      required: true,
      default: "attempted",
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    hintsUsed: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    solvedAt: {
      type: Date,
    },
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userPuzzleAttemptSchema.index({ userId: 1 });
userPuzzleAttemptSchema.index({ puzzleId: 1 });
userPuzzleAttemptSchema.index({ status: 1 });
userPuzzleAttemptSchema.index({ points: -1 });
userPuzzleAttemptSchema.index({ solvedAt: -1 });
userPuzzleAttemptSchema.index({ createdAt: -1 });

// Compound indexes
userPuzzleAttemptSchema.index({ userId: 1, puzzleId: 1 });
userPuzzleAttemptSchema.index({ userId: 1, status: 1 });
userPuzzleAttemptSchema.index({ userId: 1, points: -1 });
userPuzzleAttemptSchema.index({ userId: 1, solvedAt: -1 });

// Auto-update solvedAt when status becomes solved
userPuzzleAttemptSchema.pre("save", function (next) {
  if (this.status === "solved" && !this.solvedAt) {
    this.solvedAt = new Date();
  }
  next();
});

// Ensure virtual fields are serialized
userPuzzleAttemptSchema.set("toJSON", { virtuals: true });
userPuzzleAttemptSchema.set("toObject", { virtuals: true });

export const UserPuzzleAttempt = mongoose.model<IUserPuzzleAttempt>(
  "UserPuzzleAttempt",
  userPuzzleAttemptSchema
);
