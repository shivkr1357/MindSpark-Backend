import { Router } from "express";
import { QuizQuestionController } from "../controllers/QuizQuestionController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// Public routes
router.get("/", QuizQuestionController.getAllQuizQuestions);
router.get(
  "/category/:category",
  QuizQuestionController.getQuizQuestionsByCategory
);
router.get(
  "/difficulty/:difficulty",
  QuizQuestionController.getQuizQuestionsByDifficulty
);
router.get("/:id", QuizQuestionController.getQuizQuestionById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Admin-only routes
router.post(
  "/",
  requireRole("admin"),
  QuizQuestionController.createQuizQuestion
);
router.put(
  "/:id",
  requireRole("admin"),
  QuizQuestionController.updateQuizQuestion
);
router.delete(
  "/:id",
  requireRole("admin"),
  QuizQuestionController.deleteQuizQuestion
);

export default router;
