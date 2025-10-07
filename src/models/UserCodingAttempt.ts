import mongoose, { Schema, Document } from "mongoose";

export interface IUserCodingAttempt extends Document {
  _id: string;
  userId: string;
  codingQuestionId: string;
  code: string;
  language: string;
  status: "passed" | "failed" | "timeout" | "error";
  testCasesPassed: number;
  totalTestCases: number;
  score: number; // 0-100
  timeSpent: number; // in minutes
  memory: number; // in MB
  runtime: number; // in milliseconds
  submittedAt: Date;
  attemptNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const userCodingAttemptSchema = new Schema<IUserCodingAttempt>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    codingQuestionId: {
      type: String,
      required: true,
      ref: "CodingQuestion",
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["passed", "failed", "timeout", "error"],
      required: true,
    },
    testCasesPassed: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      required: true,
      min: 1,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    memory: {
      type: Number,
      min: 0,
      default: 0,
    },
    runtime: {
      type: Number,
      min: 0,
      default: 0,
    },
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
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
userCodingAttemptSchema.index({ userId: 1 });
userCodingAttemptSchema.index({ codingQuestionId: 1 });
userCodingAttemptSchema.index({ status: 1 });
userCodingAttemptSchema.index({ score: -1 });
userCodingAttemptSchema.index({ submittedAt: -1 });
userCodingAttemptSchema.index({ language: 1 });
userCodingAttemptSchema.index({ createdAt: -1 });

// Compound indexes
userCodingAttemptSchema.index({ userId: 1, codingQuestionId: 1 });
userCodingAttemptSchema.index({ userId: 1, status: 1 });
userCodingAttemptSchema.index({ userId: 1, score: -1 });
userCodingAttemptSchema.index({ userId: 1, submittedAt: -1 });

// Pre-save middleware to calculate score
userCodingAttemptSchema.pre("save", function (next) {
  if (this.totalTestCases > 0) {
    this.score = Math.round((this.testCasesPassed / this.totalTestCases) * 100);
  }
  next();
});

// Ensure virtual fields are serialized
userCodingAttemptSchema.set("toJSON", { virtuals: true });
userCodingAttemptSchema.set("toObject", { virtuals: true });

export const UserCodingAttempt = mongoose.model<IUserCodingAttempt>(
  "UserCodingAttempt",
  userCodingAttemptSchema
);
