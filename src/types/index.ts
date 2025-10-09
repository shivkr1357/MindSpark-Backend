// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  order?: number;
  isActive?: boolean;
  parentCategoryId?: string | null;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface IUser {
  _id?: string;
  uid: string; // Firebase UID
  name: string;
  email: string;
  role: "student" | "admin";
  avatar?: string;
  preferences?: {
    theme: "light" | "dark" | "auto";
    notifications: boolean;
    language: string;
  };
  stats?: {
    totalLessons: number;
    completedLessons: number;
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SUBJECT TYPES
// ============================================================================

export interface ISubject {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  categoryId?: string; // Reference to Category
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  estimatedTime?: string;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// LESSON TYPES (Note: Lessons are now stored in a separate collection)
// ============================================================================

export interface ILesson {
  title: string;
  content: string;
  fileUrl?: string;
  duration?: string;
  difficulty?:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  order: number;
  type?: "text" | "code" | "image" | "video" | "quiz";
}

// ============================================================================
// MODULE TYPES (Note: Modules are now stored in a separate collection)
// ============================================================================

export interface IModuleReference {
  _id?: string;
  syllabusId: string;
  title: string;
  description?: string;
  order: number;
  duration?: string;
  isActive?: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SYLLABUS TYPES
// ============================================================================

export interface ISyllabus {
  _id?: string;
  subjectId: string;
  title: string;
  description?: string;
  totalDuration?: string;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  isActive?: boolean;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// INTERVIEW QUESTION TYPES
// ============================================================================

export interface IInterviewQuestion {
  subjectId: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  explanation: string;
  categoryId?: string; // Reference to Category
  lessonId?: string; // Reference to Lesson
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FUN CONTENT TYPES
// ============================================================================

export interface IFunContent {
  _id?: string;
  type: "quiz" | "puzzle" | "meme" | "motivational";
  title: string;
  content: string;
  fileUrl?: string;
  subjectId?: string;
  categoryId?: string; // Reference to Category
  difficulty?:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description: string;
  icon?: string;
  color?: string;
  order?: number;
  isActive?: boolean;
  parentCategoryId?: string | null;
}

export interface CreateSubjectRequest {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  categoryId?: string;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  estimatedTime?: string;
}

export interface CreateSyllabusRequest {
  title: string;
  description?: string;
  totalDuration?: string;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
}

export interface CreateQuestionRequest {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  explanation: string;
  categoryId?: string;
}

export interface CreateFunContentRequest {
  type: "quiz" | "puzzle" | "meme" | "motivational";
  title: string;
  content: string;
  fileUrl?: string;
  difficulty?:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthenticatedRequest extends Request {
  user: IUser;
  firebaseUser: {
    uid: string;
    email: string;
    name: string;
  };
  id?: string;
}

// Type for authenticated route handlers
export type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
) => void | Promise<void>;

export interface AuthMiddleware {
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void;
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// ============================================================================
// QUERY TYPES
// ============================================================================

export interface GetQuestionsQuery {
  difficulty?:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetFunContentQuery {
  type?: "quiz" | "puzzle" | "meme" | "motivational";
  difficulty?:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  subjectId?: string;
  page?: number;
  limit?: number;
  random?: boolean;
}

// Import Express types
import { Request, Response, NextFunction } from "express";
