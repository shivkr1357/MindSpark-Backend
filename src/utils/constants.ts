// API Constants
export const API_VERSION = "v1";
export const API_BASE_URL = `/api/${API_VERSION}`;

// Pagination Constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File Upload Constants
export const MAX_FILE_SIZE_MB = 50;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/avi",
  "video/mov",
  "video/quicktime",
];

// User Roles
export const USER_ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
} as const;

// Content Types
export const CONTENT_TYPES = {
  QUIZ: "quiz",
  PUZZLE: "puzzle",
  MEME: "meme",
  MOTIVATIONAL: "motivational",
} as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  "Easy",
  "Medium",
  "Hard",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation failed",
  INTERNAL_ERROR: "Internal server error",
  INVALID_TOKEN: "Invalid or expired token",
  FILE_TOO_LARGE: "File size exceeds limit",
  INVALID_FILE_TYPE: "Invalid file type",
  RATE_LIMIT_EXCEEDED: "Too many requests",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
  UPLOADED: "File uploaded successfully",
  RETRIEVED: "Resource retrieved successfully",
} as const;
