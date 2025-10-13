import { Router } from "express";
import { UserProgressController } from "../controllers/UserProgressController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();
const progressController = new UserProgressController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// ========================================
// LESSON PROGRESS ROUTES
// ========================================

// Update lesson progress
router.post(
  "/lessons/:lessonId/progress",
  progressController.updateLessonProgress as any
);

// Get lesson progress
router.get(
  "/lessons/:lessonId/progress",
  progressController.getLessonProgress as any
);

// Get all user lesson progress
router.get(
  "/lessons/progress",
  progressController.getUserLessonProgress as any
);

// ========================================
// QUIZ ATTEMPT ROUTES
// ========================================

// Record quiz attempt
router.post(
  "/quizzes/:quizQuestionId/attempt",
  progressController.recordQuizAttempt as any
);

// Get quiz attempts
router.get("/quizzes/attempts", progressController.getQuizAttempts as any);

// Get attempted question IDs for user
router.get(
  "/attempted-questions",
  progressController.getAttemptedQuestionIds as any
);

// Get today's progress statistics
router.get(
  "/today-stats",
  progressController.getTodayProgressStatistics as any
);

// ========================================
// CODING ATTEMPT ROUTES
// ========================================

// Record coding attempt
router.post(
  "/coding/:codingQuestionId/attempt",
  progressController.recordCodingAttempt as any
);

// Get coding attempts
router.get("/coding/attempts", progressController.getCodingAttempts as any);

// ========================================
// PUZZLE ATTEMPT ROUTES
// ========================================

// Record puzzle attempt
router.post(
  "/puzzles/:puzzleId/attempt",
  progressController.recordPuzzleAttempt as any
);

// Get puzzle attempts
router.get("/puzzles/attempts", progressController.getPuzzleAttempts as any);

// ========================================
// BOOKMARK ROUTES
// ========================================

// Add bookmark
router.post("/bookmarks", progressController.addBookmark as any);

// Remove bookmark
router.delete(
  "/bookmarks/:resourceType/:resourceId",
  progressController.removeBookmark as any
);

// Get user bookmarks
router.get("/bookmarks", progressController.getUserBookmarks as any);

// ========================================
// ENROLLMENT ROUTES
// ========================================

// Enroll in subject
router.post(
  "/enrollments/:subjectId",
  progressController.enrollInSubject as any
);

// Update enrollment progress
router.put(
  "/enrollments/:subjectId/progress",
  progressController.updateEnrollmentProgress as any
);

// Get user enrollments
router.get("/enrollments", progressController.getUserEnrollments as any);

// Get enrollment by subject
router.get(
  "/enrollments/:subjectId",
  progressController.getEnrollmentBySubject as any
);

// ========================================
// STATISTICS & DASHBOARD
// ========================================

// Get user statistics
router.get("/statistics", progressController.getUserStatistics as any);

// Get user dashboard
router.get("/dashboard", progressController.getUserDashboard as any);

export default router;
