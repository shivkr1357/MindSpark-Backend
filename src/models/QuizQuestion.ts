import mongoose, { Schema, Document } from "mongoose";

export interface IQuizQuestion extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  totalQuestions: number;
  timeLimit?: number; // in minutes
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  categoryId?: string; // Reference to Category
  subjectId?: string;
  lessonId?: string; // Reference to Lesson
  funContentId?: string; // Reference to FunContent
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IQuestion {
  id: string;
  question: string;
  options: IOption[];
  correctAnswer: string; // ID of correct option
  explanation: string;
  points: number;
}

interface IOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const optionSchema = new Schema<IOption>({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const questionSchema = new Schema<IQuestion>({
  id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  options: [optionSchema],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  points: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
});

const quizQuestionSchema = new Schema<IQuizQuestion>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    questions: [questionSchema],
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    timeLimit: {
      type: Number,
      min: 1,
      max: 120, // max 2 hours
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
      required: true,
    },
    categoryId: {
      type: String,
      ref: "Category",
    },
    subjectId: {
      type: String,
      ref: "Subject",
    },
    lessonId: {
      type: String,
      ref: "Lesson",
    },
    funContentId: {
      type: String,
      ref: "FunContent",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
quizQuestionSchema.index({ categoryId: 1 });
quizQuestionSchema.index({ difficulty: 1 });
quizQuestionSchema.index({ subjectId: 1 });
quizQuestionSchema.index({ lessonId: 1 });
quizQuestionSchema.index({ funContentId: 1 });
quizQuestionSchema.index({ isActive: 1 });
quizQuestionSchema.index({ createdBy: 1 });
quizQuestionSchema.index({ createdAt: -1 });

// Compound indexes
quizQuestionSchema.index({ categoryId: 1, difficulty: 1 });
quizQuestionSchema.index({ subjectId: 1, categoryId: 1 });
quizQuestionSchema.index({ lessonId: 1, difficulty: 1 });

// Virtual for total points
quizQuestionSchema.virtual("totalPoints").get(function (this: IQuizQuestion) {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

// Ensure virtual fields are serialized
quizQuestionSchema.set("toJSON", { virtuals: true });
quizQuestionSchema.set("toObject", { virtuals: true });

export const QuizQuestion = mongoose.model<IQuizQuestion>(
  "QuizQuestion",
  quizQuestionSchema
);
