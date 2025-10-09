import mongoose, { Schema, Document } from "mongoose";

export interface IModule extends Document {
  _id: string;
  syllabusId: string;
  title: string;
  description?: string;
  order: number;
  duration?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>(
  {
    syllabusId: {
      type: String,
      required: true,
      ref: "Syllabus",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    duration: {
      type: String,
      default: "1 hour",
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
moduleSchema.index({ syllabusId: 1, order: 1 });
moduleSchema.index({ createdBy: 1 });

export const Module = mongoose.model<IModule>("Module", moduleSchema);
