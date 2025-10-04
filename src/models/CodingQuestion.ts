import mongoose, { Schema, Document } from "mongoose";

export interface ICodingQuestion extends Document {
  title: string;
  description: string;
  problem: string;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  category: string;
  language: string; // programming language
  tags: string[];
  constraints: string[];
  examples: IExample[];
  testCases: ITestCase[];
  hints: string[];
  solution?: string;
  timeLimit?: number; // in minutes
  memoryLimit?: number; // in MB
  points: number;
  subjectId?: string;
  interviewQuestionId?: string; // Reference to InterviewQuestion
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

interface ITestCase {
  input: string;
  expectedOutput: string;
  isPublic: boolean; // whether this test case is visible to users
}

const exampleSchema = new Schema<IExample>({
  input: {
    type: String,
    required: true,
    trim: true,
  },
  output: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    trim: true,
    maxlength: 500,
  },
});

const testCaseSchema = new Schema<ITestCase>({
  input: {
    type: String,
    required: true,
    trim: true,
  },
  expectedOutput: {
    type: String,
    required: true,
    trim: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
});

const codingQuestionSchema = new Schema<ICodingQuestion>(
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
    problem: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
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
    language: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
      },
    ],
    constraints: [
      {
        type: String,
        trim: true,
        maxlength: 200,
      },
    ],
    examples: [exampleSchema],
    testCases: [testCaseSchema],
    hints: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],
    solution: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    timeLimit: {
      type: Number,
      min: 1,
      max: 60, // max 1 hour
    },
    memoryLimit: {
      type: Number,
      min: 1,
      max: 512, // max 512 MB
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
    interviewQuestionId: {
      type: String,
      ref: "InterviewQuestion",
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
codingQuestionSchema.index({ difficulty: 1 });
codingQuestionSchema.index({ category: 1 });
codingQuestionSchema.index({ language: 1 });
codingQuestionSchema.index({ tags: 1 });
codingQuestionSchema.index({ subjectId: 1 });
codingQuestionSchema.index({ interviewQuestionId: 1 });
codingQuestionSchema.index({ isActive: 1 });
codingQuestionSchema.index({ createdBy: 1 });
codingQuestionSchema.index({ points: -1 });
codingQuestionSchema.index({ createdAt: -1 });

// Text search index (commented out to avoid language override issues)
// codingQuestionSchema.index({
//   title: "text",
//   description: "text",
//   problem: "text",
// });

// Compound indexes
codingQuestionSchema.index({ difficulty: 1, category: 1 });
codingQuestionSchema.index({ language: 1, difficulty: 1 });

// Virtual for public test cases count
codingQuestionSchema
  .virtual("publicTestCasesCount")
  .get(function (this: ICodingQuestion) {
    return this.testCases.filter((testCase) => testCase.isPublic).length;
  });

// Virtual for total test cases count
codingQuestionSchema
  .virtual("totalTestCasesCount")
  .get(function (this: ICodingQuestion) {
    return this.testCases.length;
  });

// Virtual for hint count
codingQuestionSchema.virtual("hintCount").get(function (this: ICodingQuestion) {
  return this.hints.length;
});

// Ensure virtual fields are serialized
codingQuestionSchema.set("toJSON", { virtuals: true });
codingQuestionSchema.set("toObject", { virtuals: true });

export const CodingQuestion = mongoose.model<ICodingQuestion>(
  "CodingQuestion",
  codingQuestionSchema
);
