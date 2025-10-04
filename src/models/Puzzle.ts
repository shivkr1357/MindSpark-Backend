import mongoose, { Schema, Document } from "mongoose";

export interface IPuzzle extends Document {
  title: string;
  description: string;
  type: "logic" | "math" | "word" | "visual" | "code";
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  category: string;
  puzzleData: IPuzzleData;
  solution: string;
  hints: string[];
  timeLimit?: number; // in minutes
  points: number;
  subjectId?: string;
  funContentId?: string; // Reference to FunContent
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IPuzzleData {
  question: string;
  options?: string[]; // for multiple choice puzzles
  grid?: string[][]; // for grid-based puzzles
  pieces?: string[]; // for jigsaw-type puzzles
  sequence?: string[]; // for sequence puzzles
  customData?: any; // for complex puzzles
}

const puzzleDataSchema = new Schema<IPuzzleData>({
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  options: [
    {
      type: String,
      trim: true,
      maxlength: 200,
    },
  ],
  grid: [
    [
      {
        type: String,
        trim: true,
      },
    ],
  ],
  pieces: [
    {
      type: String,
      trim: true,
    },
  ],
  sequence: [
    {
      type: String,
      trim: true,
    },
  ],
  customData: {
    type: Schema.Types.Mixed,
  },
});

const puzzleSchema = new Schema<IPuzzle>(
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
    type: {
      type: String,
      enum: ["logic", "math", "word", "visual", "code"],
      required: true,
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
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    puzzleData: puzzleDataSchema,
    solution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    hints: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],
    timeLimit: {
      type: Number,
      min: 1,
      max: 60, // max 1 hour
    },
    points: {
      type: Number,
      default: 10,
      min: 1,
      max: 100,
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
puzzleSchema.index({ type: 1 });
puzzleSchema.index({ difficulty: 1 });
puzzleSchema.index({ category: 1 });
puzzleSchema.index({ subjectId: 1 });
puzzleSchema.index({ funContentId: 1 });
puzzleSchema.index({ isActive: 1 });
puzzleSchema.index({ createdBy: 1 });
puzzleSchema.index({ createdAt: -1 });

// Compound indexes
puzzleSchema.index({ type: 1, difficulty: 1 });
puzzleSchema.index({ category: 1, type: 1 });

// Virtual for hint count
puzzleSchema.virtual("hintCount").get(function (this: IPuzzle) {
  return this.hints.length;
});

// Ensure virtual fields are serialized
puzzleSchema.set("toJSON", { virtuals: true });
puzzleSchema.set("toObject", { virtuals: true });

export const Puzzle = mongoose.model<IPuzzle>("Puzzle", puzzleSchema);
