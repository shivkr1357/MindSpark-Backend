import mongoose, { Schema, Document } from "mongoose";

export interface IMeme extends Document {
  title: string;
  description?: string;
  type: "image" | "video" | "gif" | "text";
  category: "programming" | "coding" | "tech" | "general" | "motivational";
  content: {
    url?: string; // for image/video/gif
    text?: string; // for text memes
    caption?: string;
  };
  tags: string[];
  likes: number;
  shares: number;
  views: number;
  difficulty?:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  subjectId?: string;
  funContentId?: string; // Reference to FunContent
  isActive: boolean;
  isNSFW: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema({
  url: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  caption: {
    type: String,
    trim: true,
    maxlength: 500,
  },
});

const memeSchema = new Schema<IMeme>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ["image", "video", "gif", "text"],
      required: true,
    },
    category: {
      type: String,
      enum: ["programming", "coding", "tech", "general", "motivational"],
      required: true,
    },
    content: contentSchema,
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
      },
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
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
    },
    subjectId: {
      type: String,
      ref: "Subject",
    },
    funContentId: {
      type: String,
      ref: "FunContent",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNSFW: {
      type: Boolean,
      default: false,
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
memeSchema.index({ type: 1 });
memeSchema.index({ category: 1 });
memeSchema.index({ tags: 1 });
memeSchema.index({ subjectId: 1 });
memeSchema.index({ funContentId: 1 });
memeSchema.index({ isActive: 1 });
memeSchema.index({ isNSFW: 1 });
memeSchema.index({ createdBy: 1 });
memeSchema.index({ likes: -1 });
memeSchema.index({ views: -1 });
memeSchema.index({ createdAt: -1 });

// Text search index (commented out to avoid language override issues)
// memeSchema.index({
//   title: "text",
//   description: "text",
//   "content.text": "text",
// });

// Compound indexes
memeSchema.index({ category: 1, type: 1 });
memeSchema.index({ isActive: 1, isNSFW: 1 });

// Virtual for engagement score
memeSchema.virtual("engagementScore").get(function (this: IMeme) {
  return this.likes + this.shares + this.views;
});

// Virtual for popularity rating
memeSchema.virtual("popularityRating").get(function (this: IMeme) {
  const daysSinceCreation =
    (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  return this.engagementScore / Math.max(daysSinceCreation, 1);
});

// Ensure virtual fields are serialized
memeSchema.set("toJSON", { virtuals: true });
memeSchema.set("toObject", { virtuals: true });

export const Meme = mongoose.model<IMeme>("Meme", memeSchema);
