import mongoose, { Schema, Document } from "mongoose";

export interface IProgressStats extends Document {
  userId?: string;
  lessonsCompleted: number;
  questionsAnswered: number;
  accuracy: number;
  totalStudyTime: number; // in minutes
  streak: number;
  level: number;
  experience: number;
  lastUpdated: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const progressStatsSchema = new Schema<IProgressStats>(
  {
    userId: {
      type: String,
      ref: "User",
      unique: true,
    },
    lessonsCompleted: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    questionsAnswered: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    totalStudyTime: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    streak: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
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
// progressStatsSchema.index({ userId: 1 }); // Removed - userId already has unique: true which creates index
progressStatsSchema.index({ level: -1 });
progressStatsSchema.index({ experience: -1 });
progressStatsSchema.index({ streak: -1 });
progressStatsSchema.index({ lastUpdated: -1 });
progressStatsSchema.index({ createdAt: -1 });

// Pre-save middleware to update lastUpdated
progressStatsSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Ensure virtual fields are serialized
progressStatsSchema.set("toJSON", { virtuals: true });
progressStatsSchema.set("toObject", { virtuals: true });

export const ProgressStats = mongoose.model<IProgressStats>(
  "ProgressStats",
  progressStatsSchema
);
