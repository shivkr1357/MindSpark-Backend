import mongoose, { Schema, Document } from "mongoose";
import { IFunContent } from "../types/index.js";

export interface IFunContentDocument extends IFunContent, Document {
  _id: string; // Add this line
}

const funContentSchema = new Schema<IFunContentDocument>(
  {
    type: {
      type: String,
      enum: ["quiz", "puzzle", "meme", "motivational"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    subjectId: {
      type: String,
      ref: "Subject",
      default: null,
    },
    categoryId: {
      type: String,
      ref: "Category",
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
      default: "Easy",
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
funContentSchema.index({ type: 1 });
funContentSchema.index({ subjectId: 1 });
funContentSchema.index({ categoryId: 1 });
funContentSchema.index({ difficulty: 1 });
// funContentSchema.index({ title: "text", content: "text" });
funContentSchema.index({ createdBy: 1 });
funContentSchema.index({ createdAt: -1 });

// Compound indexes for efficient filtering
funContentSchema.index({ type: 1, subjectId: 1 });
funContentSchema.index({ type: 1, difficulty: 1 });
funContentSchema.index({ type: 1, categoryId: 1 });
funContentSchema.index({ subjectId: 1, difficulty: 1 });

// Virtual for content type display name
funContentSchema
  .virtual("typeDisplayName")
  .get(function (this: IFunContentDocument) {
    const typeMap: Record<string, string> = {
      quiz: "Quiz",
      puzzle: "Puzzle",
      meme: "Meme",
      motivational: "Motivational",
    };
    return typeMap[this.type] || this.type;
  });

// Virtual for engagement score (would be calculated based on user interactions)
funContentSchema.virtual("engagementScore").get(function () {
  // This would typically be calculated from user interaction data
  return 0;
});

// Ensure virtual fields are serialized
funContentSchema.set("toJSON", { virtuals: true });
funContentSchema.set("toObject", { virtuals: true });

export const FunContent = mongoose.model<IFunContentDocument>(
  "FunContent",
  funContentSchema
);
