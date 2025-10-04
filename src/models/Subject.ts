import mongoose, { Schema, Document } from "mongoose";
import { ISubject } from "../types/index.js";

export interface ISubjectDocument extends ISubject, Document {
  _id: string;
}

const subjectSchema = new Schema<ISubjectDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      default: "📚",
    },
    color: {
      type: String,
      default: "#3B82F6",
      validate: {
        validator: function (v: string) {
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: "Color must be a valid hex color code",
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
    estimatedTime: {
      type: String,
      default: "1 hour",
    },
    totalLessons: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedLessons: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (this: ISubjectDocument, value: number) {
          return value <= (this.totalLessons || 0);
        },
        message: "Completed lessons cannot exceed total lessons",
      },
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
// subjectSchema.index({ title: "text", description: "text" });
subjectSchema.index({ difficulty: 1 });
subjectSchema.index({ createdBy: 1 });
subjectSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate progress
subjectSchema.pre("save", function (next) {
  if (this.totalLessons && this.totalLessons > 0) {
    this.progress = Math.round(
      (this.completedLessons || 0 / this.totalLessons || 0) * 100
    );
  } else {
    this.progress = 0;
  }
  next();
});

// Ensure virtual fields are serialized
subjectSchema.set("toJSON", { virtuals: true });
subjectSchema.set("toObject", { virtuals: true });

export const Subject = mongoose.model<ISubjectDocument>(
  "Subject",
  subjectSchema
);
