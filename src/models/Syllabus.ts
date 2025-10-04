import mongoose, { Schema, Document } from "mongoose";
import { ISyllabus, IModule, ILesson } from "../types/index.js";

export interface ISyllabusDocument extends ISyllabus, Document {
  _id: string;
}

const lessonSchema = new Schema<ILesson>(
  {
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
    },
    fileUrl: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: "10 minutes",
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
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: ["text", "code", "image", "video", "quiz"],
      default: "text",
    },
  },
  { _id: false }
);

const moduleSchema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lessons: [lessonSchema],
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const syllabusSchema = new Schema<ISyllabusDocument>(
  {
    subjectId: {
      type: String,
      required: true,
      ref: "Subject",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    modules: [moduleSchema],
    totalDuration: {
      type: String,
      default: "1 hour",
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
      required: true,
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
syllabusSchema.index({ subjectId: 1 });
// syllabusSchema.index({ title: "text", description: "text" });
syllabusSchema.index({ difficulty: 1 });
syllabusSchema.index({ createdBy: 1 });
syllabusSchema.index({ createdAt: -1 });

// Virtual for total lessons count
syllabusSchema.virtual("totalLessons").get(function () {
  return this.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
});

// Virtual for completion percentage (would be calculated based on user progress)
syllabusSchema.virtual("completionPercentage").get(function () {
  // This would typically be calculated from user progress data
  return 0;
});

// Ensure virtual fields are serialized
syllabusSchema.set("toJSON", { virtuals: true });
syllabusSchema.set("toObject", { virtuals: true });

export const Syllabus = mongoose.model<ISyllabusDocument>(
  "Syllabus",
  syllabusSchema
);
