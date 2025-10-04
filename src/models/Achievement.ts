import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  title: string;
  description: string;
  icon: string;
  color: string;
  date: Date;
  userId?: string;
  type: "lesson" | "course" | "streak" | "challenge" | "milestone";
  points: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
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
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userId: {
      type: String,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["lesson", "course", "streak", "challenge", "milestone"],
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
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
achievementSchema.index({ userId: 1 });
achievementSchema.index({ type: 1 });
achievementSchema.index({ isActive: 1 });
achievementSchema.index({ date: -1 });
achievementSchema.index({ points: -1 });
achievementSchema.index({ createdAt: -1 });

// Ensure virtual fields are serialized
achievementSchema.set("toJSON", { virtuals: true });
achievementSchema.set("toObject", { virtuals: true });

export const Achievement = mongoose.model<IAchievement>(
  "Achievement",
  achievementSchema
);
