import mongoose, { Schema, Document } from "mongoose";

export interface IUserBookmark extends Document {
  _id: string;
  userId: string;
  resourceType:
    | "lesson"
    | "question"
    | "coding"
    | "quiz"
    | "puzzle"
    | "subject";
  resourceId: string;
  title: string; // Cached title for quick display
  notes?: string; // Optional user notes
  createdAt: Date;
  updatedAt: Date;
}

const userBookmarkSchema = new Schema<IUserBookmark>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    resourceType: {
      type: String,
      enum: ["lesson", "question", "coding", "quiz", "puzzle", "subject"],
      required: true,
    },
    resourceId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userBookmarkSchema.index({ userId: 1 });
userBookmarkSchema.index({ resourceType: 1 });
userBookmarkSchema.index({ resourceId: 1 });
userBookmarkSchema.index({ createdAt: -1 });

// Compound indexes
userBookmarkSchema.index(
  { userId: 1, resourceType: 1, resourceId: 1 },
  { unique: true }
); // One bookmark per user per resource
userBookmarkSchema.index({ userId: 1, resourceType: 1 });
userBookmarkSchema.index({ userId: 1, createdAt: -1 });

// Ensure virtual fields are serialized
userBookmarkSchema.set("toJSON", { virtuals: true });
userBookmarkSchema.set("toObject", { virtuals: true });

export const UserBookmark = mongoose.model<IUserBookmark>(
  "UserBookmark",
  userBookmarkSchema
);
