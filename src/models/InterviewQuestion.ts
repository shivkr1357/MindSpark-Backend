import mongoose, { Schema, Document } from "mongoose";
import { IInterviewQuestion } from "../types/index.js";

export interface IInterviewQuestionDocument
  extends IInterviewQuestion,
    Document {
  _id: string;
}

const interviewQuestionSchema = new Schema<IInterviewQuestionDocument>(
  {
    subjectId: {
      type: String,
      required: true,
      ref: "Subject",
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    options: {
      type: [String] as any,
      required: true,
      validate: {
        validator: function (options: string[]) {
          return options.length >= 2 && options.length <= 6;
        },
        message: "Options must contain between 2 and 6 choices",
      },
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (this: IInterviewQuestionDocument, value: number) {
          return value < this.options.length;
        },
        message: "Correct answer index must be within options range",
      },
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
    explanation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    categoryId: {
      type: String,
      ref: "Category",
    },
    lessonId: {
      type: String,
      ref: "Lesson",
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
interviewQuestionSchema.index({ subjectId: 1 });
interviewQuestionSchema.index({ difficulty: 1 });
interviewQuestionSchema.index({ categoryId: 1 });
interviewQuestionSchema.index({ lessonId: 1 });
// interviewQuestionSchema.index({ question: "text", explanation: "text" });
interviewQuestionSchema.index({ createdBy: 1 });
interviewQuestionSchema.index({ createdAt: -1 });

// Compound index for efficient filtering
interviewQuestionSchema.index({ subjectId: 1, difficulty: 1 });
interviewQuestionSchema.index({ subjectId: 1, categoryId: 1 });
interviewQuestionSchema.index({ lessonId: 1, difficulty: 1 });
interviewQuestionSchema.index({ featured: 1, isActive: 1, views: -1 });

// Virtual for correct answer text
interviewQuestionSchema.virtual("correctAnswerText").get(function () {
  return this.options[this.correctAnswer];
});

// Virtual for options with IDs (for frontend compatibility)
interviewQuestionSchema.virtual("optionsWithIds").get(function () {
  return this.options.map((option, index) => ({
    id: index,
    text: option,
    isCorrect: index === this.correctAnswer,
  }));
});

// Ensure virtual fields are serialized
interviewQuestionSchema.set("toJSON", { virtuals: true });
interviewQuestionSchema.set("toObject", { virtuals: true });

export const InterviewQuestion = mongoose.model<IInterviewQuestionDocument>(
  "InterviewQuestion",
  interviewQuestionSchema
);
