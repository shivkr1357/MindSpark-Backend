import mongoose, { Schema, Document } from "mongoose";

export interface IMotivation extends Document {
  title: string;
  content: string;
  type: "quote" | "story" | "tip" | "advice" | "inspiration";
  category:
    | "career"
    | "coding"
    | "learning"
    | "productivity"
    | "mindset"
    | "general";
  author?: string;
  source?: string;
  tags: string[];
  difficulty?:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  media?: {
    image?: string;
    video?: string;
    audio?: string;
  };
  likes: number;
  shares: number;
  views: number;
  bookmarks: number;
  subjectId?: string;
  funContentId?: string; // Reference to FunContent
  isActive: boolean;
  isFeatured: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema({
  image: {
    type: String,
    trim: true,
  },
  video: {
    type: String,
    trim: true,
  },
  audio: {
    type: String,
    trim: true,
  },
});

const motivationSchema = new Schema<IMotivation>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: ["quote", "story", "tip", "advice", "inspiration"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "career",
        "coding",
        "learning",
        "productivity",
        "mindset",
        "general",
      ],
      required: true,
    },
    author: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    source: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
      },
    ],
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
    media: mediaSchema,
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
    bookmarks: {
      type: Number,
      default: 0,
      min: 0,
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
    isFeatured: {
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
motivationSchema.index({ type: 1 });
motivationSchema.index({ category: 1 });
motivationSchema.index({ tags: 1 });
motivationSchema.index({ subjectId: 1 });
motivationSchema.index({ funContentId: 1 });
motivationSchema.index({ isActive: 1 });
motivationSchema.index({ isFeatured: 1 });
motivationSchema.index({ createdBy: 1 });
motivationSchema.index({ likes: -1 });
motivationSchema.index({ views: -1 });
motivationSchema.index({ bookmarks: -1 });
motivationSchema.index({ createdAt: -1 });

// Text search index
// motivationSchema.index({ title: "text", content: "text", author: "text" });

// Compound indexes
motivationSchema.index({ category: 1, type: 1 });
motivationSchema.index({ isActive: 1, isFeatured: 1 });

// Virtual for engagement score
motivationSchema.virtual("engagementScore").get(function (this: IMotivation) {
  return this.likes + this.shares + this.views + this.bookmarks;
});

// Virtual for content length category
motivationSchema.virtual("contentLength").get(function (this: IMotivation) {
  const length = this.content.length;
  if (length <= 100) return "short";
  if (length <= 500) return "medium";
  return "long";
});

// Ensure virtual fields are serialized
motivationSchema.set("toJSON", { virtuals: true });
motivationSchema.set("toObject", { virtuals: true });

export const Motivation = mongoose.model<IMotivation>(
  "Motivation",
  motivationSchema
);
