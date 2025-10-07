import mongoose, { Schema, Document } from "mongoose";

export interface IUserQuizAttempt extends Document {
  _id: string;
  userId: string;
  quizQuestionId: string;
  answers: IQuizAnswer[];
  score: number; // 0-100
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in minutes
  completedAt: Date;
  attemptNumber: number;
  isPassed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IQuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  points: number;
}

const quizAnswerSchema = new Schema<IQuizAnswer>({
  questionId: {
    type: String,
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 0,
  },
});

const userQuizAttemptSchema = new Schema<IUserQuizAttempt>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    quizQuestionId: {
      type: String,
      required: true,
      ref: "QuizQuestion",
    },
    answers: [quizAnswerSchema],
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    completedAt: {
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
    isPassed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userQuizAttemptSchema.index({ userId: 1 });
userQuizAttemptSchema.index({ quizQuestionId: 1 });
userQuizAttemptSchema.index({ score: -1 });
userQuizAttemptSchema.index({ completedAt: -1 });
userQuizAttemptSchema.index({ isPassed: 1 });
userQuizAttemptSchema.index({ createdAt: -1 });

// Compound indexes
userQuizAttemptSchema.index({ userId: 1, quizQuestionId: 1 });
userQuizAttemptSchema.index({ userId: 1, score: -1 });
userQuizAttemptSchema.index({ userId: 1, completedAt: -1 });
userQuizAttemptSchema.index({ userId: 1, isPassed: 1 });

// Pre-save middleware to calculate score and isPassed
userQuizAttemptSchema.pre("save", function (next) {
  if (this.totalQuestions > 0) {
    this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100);
    this.isPassed = this.score >= 60; // 60% passing threshold
  }
  next();
});

// Ensure virtual fields are serialized
userQuizAttemptSchema.set("toJSON", { virtuals: true });
userQuizAttemptSchema.set("toObject", { virtuals: true });

export const UserQuizAttempt = mongoose.model<IUserQuizAttempt>(
  "UserQuizAttempt",
  userQuizAttemptSchema
);
