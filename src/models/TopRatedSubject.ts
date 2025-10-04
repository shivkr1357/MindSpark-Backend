import mongoose, { Schema, Document } from "mongoose";

export interface ITopRatedSubject extends Document {
  _id: string;
  title: string;
  rating: number;
  students: number;
  progress: number;
  color: string;
  icon: string;
  subjectId?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const topRatedSubjectSchema = new Schema<ITopRatedSubject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    students: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    color: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: "Color must be a valid hex color code",
      },
    },
    icon: {
      type: String,
      required: true,
      trim: true,
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
topRatedSubjectSchema.index({ subjectId: 1 });
topRatedSubjectSchema.index({ isActive: 1 });
topRatedSubjectSchema.index({ rating: -1 });
topRatedSubjectSchema.index({ students: -1 });
topRatedSubjectSchema.index({ progress: -1 });
topRatedSubjectSchema.index({ createdAt: -1 });

// Ensure virtual fields are serialized
topRatedSubjectSchema.set("toJSON", { virtuals: true });
topRatedSubjectSchema.set("toObject", { virtuals: true });

export const TopRatedSubject = mongoose.model<ITopRatedSubject>(
  "TopRatedSubject",
  topRatedSubjectSchema
);
