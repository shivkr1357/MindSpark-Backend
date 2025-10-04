import mongoose, { Schema, Document } from "mongoose";

export interface IFeaturedQuestion extends Document {
  title: string;
  category: string;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  views: number;
  answered: boolean;
  questionId?: string;
  subjectId?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const featuredQuestionSchema = new Schema<IFeaturedQuestion>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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
    views: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    answered: {
      type: Boolean,
      default: false,
    },
    questionId: {
      type: String,
      ref: "InterviewQuestion",
    },
    subjectId: {
      type: String,
      ref: "Subject",
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
featuredQuestionSchema.index({ category: 1 });
featuredQuestionSchema.index({ difficulty: 1 });
featuredQuestionSchema.index({ subjectId: 1 });
featuredQuestionSchema.index({ isActive: 1 });
featuredQuestionSchema.index({ views: -1 });
featuredQuestionSchema.index({ answered: 1 });
featuredQuestionSchema.index({ createdAt: -1 });

// Ensure virtual fields are serialized
featuredQuestionSchema.set("toJSON", { virtuals: true });
featuredQuestionSchema.set("toObject", { virtuals: true });

export const FeaturedQuestion = mongoose.model<IFeaturedQuestion>(
  "FeaturedQuestion",
  featuredQuestionSchema
);
