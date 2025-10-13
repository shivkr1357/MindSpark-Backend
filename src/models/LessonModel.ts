import mongoose, { Schema, Document } from "mongoose";

export interface ILessonModel extends Document {
  _id: string;
  moduleId: string;
  syllabusId: string;
  title: string;
  content: string;
  type: "text" | "code" | "image" | "video" | "quiz";
  fileUrl?: string;
  duration: string;
  difficulty?: string;
  order: number;
  resources?: Array<{
    type: "link" | "document" | "video" | "image" | "code";
    title: string;
    url: string;
  }>;
  objectives?: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const lessonModelSchema = new Schema<ILessonModel>(
  {
    moduleId: {
      type: String,
      required: true,
      ref: "Module",
    },
    syllabusId: {
      type: String,
      required: true,
      ref: "Syllabus",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "code", "image", "video", "quiz"],
      default: "text",
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      default: "10 min",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Beginner", "Intermediate", "Advanced"],
      default: "Easy",
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    resources: [
      {
        type: {
          type: String,
          enum: ["link", "document", "video", "image", "code"],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    objectives: [
      {
        type: String,
      },
    ],
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
lessonModelSchema.index({ moduleId: 1, order: 1 });
lessonModelSchema.index({ syllabusId: 1 });
lessonModelSchema.index({ createdBy: 1 });
lessonModelSchema.index({ type: 1 });

export const LessonModel = mongoose.model<ILessonModel>(
  "LessonModel",
  lessonModelSchema
);
