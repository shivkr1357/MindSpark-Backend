import mongoose, { Schema, Document } from "mongoose";

export interface IUserAttemptedQuestion extends Document {
  userId: string;
  questionId: string;
  questionType: "quiz" | "interview" | "coding" | "puzzle";
  subjectId?: string;
  moduleId?: string;
  lessonId?: string;
  categoryId?: string;
  difficulty?:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  isCorrect: boolean;
  selectedAnswer?: string;
  points: number;
  timeSpent: number; // in seconds
  attemptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userAttemptedQuestionSchema = new Schema<IUserAttemptedQuestion>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    questionId: {
      type: String,
      required: true,
      index: true,
    },
    questionType: {
      type: String,
      enum: ["quiz", "interview", "coding", "puzzle"],
      required: true,
      index: true,
    },
    subjectId: {
      type: String,
      index: true,
    },
    moduleId: {
      type: String,
      index: true,
    },
    lessonId: {
      type: String,
      index: true,
    },
    categoryId: {
      type: String,
      index: true,
    },
    difficulty: {
      type: String,
      enum: [
        "Easy",
        "Medium",
        "Hard",
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
      ],
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },
    selectedAnswer: {
      type: String,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    timeSpent: {
      type: Number,
      required: true,
      default: 0,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
userAttemptedQuestionSchema.index(
  { userId: 1, questionId: 1 },
  { unique: true }
);
userAttemptedQuestionSchema.index({ userId: 1, questionType: 1 });
userAttemptedQuestionSchema.index({ userId: 1, attemptedAt: -1 });
userAttemptedQuestionSchema.index({ userId: 1, isCorrect: 1 });
userAttemptedQuestionSchema.index({ userId: 1, subjectId: 1 });
userAttemptedQuestionSchema.index({ userId: 1, categoryId: 1 });

// Pre-save middleware to ensure unique combination
userAttemptedQuestionSchema.pre("save", function (next) {
  // This will be handled by the unique index, but we can add validation here if needed
  next();
});

export const UserAttemptedQuestion = mongoose.model<IUserAttemptedQuestion>(
  "UserAttemptedQuestion",
  userAttemptedQuestionSchema
);
