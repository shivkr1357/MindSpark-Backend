import mongoose, { Schema, Document } from "mongoose";

export interface IFeaturedContent extends Document {
  title: string;
  description: string;
  type: "course" | "tutorial" | "challenge" | "workshop";
  duration: string;
  rating: number;
  students: number;
  color: string;
  icon: string;
  subjectId?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const featuredContentSchema = new Schema<IFeaturedContent>(
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
    type: {
      type: String,
      enum: ["course", "tutorial", "challenge", "workshop"],
      required: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
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
featuredContentSchema.index({ type: 1 });
featuredContentSchema.index({ subjectId: 1 });
featuredContentSchema.index({ isActive: 1 });
featuredContentSchema.index({ rating: -1 });
featuredContentSchema.index({ students: -1 });
featuredContentSchema.index({ createdAt: -1 });

// Ensure virtual fields are serialized
featuredContentSchema.set("toJSON", { virtuals: true });
featuredContentSchema.set("toObject", { virtuals: true });

export const FeaturedContent = mongoose.model<IFeaturedContent>(
  "FeaturedContent",
  featuredContentSchema
);
