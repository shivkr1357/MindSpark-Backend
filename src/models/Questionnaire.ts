import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionnaire extends Document {
  title: string;
  description: string;
  subjectId?: string;
  categoryId?: string;
  lessonId?: string;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  questions: IQuestionnaireQuestion[];
  totalQuestions: number;
  timeLimit?: number; // in minutes
  isAIGenerated: boolean;
  aiPrompt?: string; // The prompt used to generate questions
  aiModel?: string; // The AI model used (e.g., "gpt-3.5-turbo", "gpt-4")
  tags: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestionnaireQuestion {
  id: string;
  question: string;
  questionType: "multiple_choice" | "true_false" | "short_answer" | "essay";
  options?: IQuestionnaireOption[];
  correctAnswer?: string | number; // For multiple choice, it's the option index or ID
  explanation: string;
  points: number;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  tags: string[];
  aiGenerated: boolean;
}

export interface IQuestionnaireOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const questionnaireOptionSchema = new Schema<IQuestionnaireOption>({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const questionnaireQuestionSchema = new Schema<IQuestionnaireQuestion>({
  id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  questionType: {
    type: String,
    enum: ["multiple_choice", "true_false", "short_answer", "essay"],
    required: true,
  },
  options: [questionnaireOptionSchema],
  correctAnswer: {
    type: Schema.Types.Mixed, // Can be string, number, or boolean
  },
  explanation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  points: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
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
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },
  ],
  aiGenerated: {
    type: Boolean,
    default: false,
  },
});

const questionnaireSchema = new Schema<IQuestionnaire>(
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
    subjectId: {
      type: String,
      ref: "Subject",
    },
    categoryId: {
      type: String,
      ref: "Category",
    },
    lessonId: {
      type: String,
      ref: "Lesson",
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
    questions: [questionnaireQuestionSchema],
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    timeLimit: {
      type: Number,
      min: 1,
      max: 180, // max 3 hours
    },
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    aiPrompt: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    aiModel: {
      type: String,
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
questionnaireSchema.index({ subjectId: 1 });
questionnaireSchema.index({ categoryId: 1 });
questionnaireSchema.index({ difficulty: 1 });
questionnaireSchema.index({ isAIGenerated: 1 });
questionnaireSchema.index({ isActive: 1 });
questionnaireSchema.index({ createdBy: 1 });
questionnaireSchema.index({ tags: 1 });

export const Questionnaire = mongoose.model<IQuestionnaire>(
  "Questionnaire",
  questionnaireSchema
);
