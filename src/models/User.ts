import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/index.js";

export interface IUserDocument extends IUser, Document {
  _id: string;
}

const userSchema = new Schema<IUserDocument>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    avatar: {
      type: String,
      default: null,
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "auto",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: "en",
      },
    },
    stats: {
      totalLessons: {
        type: Number,
        default: 0,
      },
      completedLessons: {
        type: Number,
        default: 0,
      },
      totalQuestions: {
        type: Number,
        default: 0,
      },
      correctAnswers: {
        type: Number,
        default: 0,
      },
      streak: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
// userSchema.index({ email: 1 }); // Removed - email already has unique: true which creates index
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user accuracy percentage
userSchema.virtual("accuracy").get(function (this: IUserDocument) {
  if (!this.stats?.totalQuestions || this.stats.totalQuestions === 0) return 0;
  return Math.round(
    (this.stats.correctAnswers / this.stats.totalQuestions) * 100
  );
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export const User = mongoose.model<IUserDocument>("User", userSchema);
