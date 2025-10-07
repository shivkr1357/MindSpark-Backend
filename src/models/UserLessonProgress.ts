import mongoose, { Schema, Document } from "mongoose";

export interface IUserLessonProgress extends Document {
  _id: string;
  userId: string;
  lessonId: string;
  progress: number; // 0-100
  completed: boolean;
  timeSpent: number; // in minutes
  lastAccessedAt: Date;
  completedAt?: Date;
  sectionsCompleted: string[]; // Array of section IDs or content IDs
  createdAt: Date;
  updatedAt: Date;
}

const userLessonProgressSchema = new Schema<IUserLessonProgress>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    lessonId: {
      type: String,
      required: true,
      ref: "Lesson",
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    sectionsCompleted: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userLessonProgressSchema.index({ userId: 1 });
userLessonProgressSchema.index({ lessonId: 1 });
userLessonProgressSchema.index({ completed: 1 });
userLessonProgressSchema.index({ lastAccessedAt: -1 });
userLessonProgressSchema.index({ progress: -1 });
userLessonProgressSchema.index({ createdAt: -1 });

// Compound indexes
userLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true }); // One progress record per user per lesson
userLessonProgressSchema.index({ userId: 1, completed: 1 });
userLessonProgressSchema.index({ userId: 1, lastAccessedAt: -1 });

// Auto-update completedAt when progress reaches 100%
userLessonProgressSchema.pre("save", function (next) {
  if (this.progress >= 100 && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
  }
  next();
});

// Ensure virtual fields are serialized
userLessonProgressSchema.set("toJSON", { virtuals: true });
userLessonProgressSchema.set("toObject", { virtuals: true });

export const UserLessonProgress = mongoose.model<IUserLessonProgress>(
  "UserLessonProgress",
  userLessonProgressSchema
);
