import mongoose, { Schema, Document } from "mongoose";
import { ISyllabus } from "../types/index.js";

export interface ISyllabusDocument extends ISyllabus, Document {
  _id: string;
}

const syllabusSchema = new Schema<ISyllabusDocument>(
  {
    subjectId: {
      type: String,
      required: true,
      ref: "Subject",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    totalDuration: {
      type: String,
      default: "1 hour",
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
syllabusSchema.index({ subjectId: 1 });
syllabusSchema.index({ difficulty: 1 });
syllabusSchema.index({ createdBy: 1 });
syllabusSchema.index({ createdAt: -1 });

// Ensure virtual fields are serialized
syllabusSchema.set("toJSON", { virtuals: true });
syllabusSchema.set("toObject", { virtuals: true });

export const Syllabus = mongoose.model<ISyllabusDocument>(
  "Syllabus",
  syllabusSchema
);
