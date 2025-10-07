import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  description: string;
  content: ILessonContent[];
  duration: number; // in minutes
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  categoryId?: string; // Reference to Category
  tags: string[];
  objectives: string[];
  prerequisites: string[];
  resources: IResource[];
  exercises: IExercise[];
  quiz?: string; // Reference to QuizQuestion ID
  order: number; // order within module/syllabus
  moduleId?: string; // Reference to module within syllabus
  syllabusId?: string; // Reference to Syllabus
  subjectId?: string; // Reference to Subject
  isActive: boolean;
  isFree: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ILessonContent {
  type: "text" | "video" | "image" | "code" | "interactive" | "quiz";
  title: string;
  content: string;
  metadata?: {
    url?: string; // for video/image
    code?: string; // for code blocks
    language?: string; // for code blocks
    duration?: number; // for video
  };
  order: number;
}

interface IResource {
  title: string;
  type: "link" | "document" | "video" | "article" | "book";
  url?: string;
  description?: string;
}

interface IExercise {
  title: string;
  description: string;
  type: "coding" | "multiple-choice" | "fill-in-blank" | "essay" | "practical";
  content: string;
  solution?: string;
  points: number;
}

const resourceSchema = new Schema<IResource>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  type: {
    type: String,
    enum: ["link", "document", "video", "article", "book"],
    required: true,
  },
  url: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
});

const exerciseSchema = new Schema<IExercise>({
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
    maxlength: 1000,
  },
  type: {
    type: String,
    enum: ["coding", "multiple-choice", "fill-in-blank", "essay", "practical"],
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  solution: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  points: {
    type: Number,
    default: 5,
    min: 1,
    max: 50,
  },
});

const lessonContentSchema = new Schema<ILessonContent>({
  type: {
    type: String,
    enum: ["text", "video", "image", "code", "interactive", "quiz"],
    required: true,
  },
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
    maxlength: 5000,
  },
  metadata: {
    url: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    duration: {
      type: Number,
      min: 0,
    },
  },
  order: {
    type: Number,
    required: true,
    min: 1,
  },
});

const lessonSchema = new Schema<ILesson>(
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
      maxlength: 1000,
    },
    content: [lessonContentSchema],
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 300, // max 5 hours
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
    categoryId: {
      type: String,
      ref: "Category",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
      },
    ],
    objectives: [
      {
        type: String,
        trim: true,
        maxlength: 200,
      },
    ],
    prerequisites: [
      {
        type: String,
        trim: true,
        maxlength: 200,
      },
    ],
    resources: [resourceSchema],
    exercises: [exerciseSchema],
    quiz: {
      type: String,
      ref: "QuizQuestion",
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    moduleId: {
      type: String,
      trim: true,
    },
    syllabusId: {
      type: String,
      ref: "Syllabus",
    },
    subjectId: {
      type: String,
      ref: "Subject",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFree: {
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
lessonSchema.index({ difficulty: 1 });
lessonSchema.index({ categoryId: 1 });
lessonSchema.index({ tags: 1 });
lessonSchema.index({ syllabusId: 1 });
lessonSchema.index({ subjectId: 1 });
lessonSchema.index({ moduleId: 1 });
lessonSchema.index({ isActive: 1 });
lessonSchema.index({ isFree: 1 });
lessonSchema.index({ createdBy: 1 });
lessonSchema.index({ order: 1 });
lessonSchema.index({ createdAt: -1 });

// Text search index
// lessonSchema.index({ title: "text", description: "text" });

// Compound indexes
lessonSchema.index({ syllabusId: 1, order: 1 });
lessonSchema.index({ subjectId: 1, difficulty: 1 });
lessonSchema.index({ moduleId: 1, order: 1 });

// Virtual for content count
lessonSchema.virtual("contentCount").get(function (this: ILesson) {
  return this.content.length;
});

// Virtual for exercise count
lessonSchema.virtual("exerciseCount").get(function (this: ILesson) {
  return this.exercises.length;
});

// Virtual for total points
lessonSchema.virtual("totalPoints").get(function (this: ILesson) {
  return this.exercises.reduce((total, exercise) => total + exercise.points, 0);
});

// Virtual for resource count
lessonSchema.virtual("resourceCount").get(function (this: ILesson) {
  return this.resources.length;
});

// Ensure virtual fields are serialized
lessonSchema.set("toJSON", { virtuals: true });
lessonSchema.set("toObject", { virtuals: true });

export const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
