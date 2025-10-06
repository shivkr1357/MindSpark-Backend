import { Router } from "express";
import { QuizQuestionController } from "../controllers/QuizQuestionController.js";
import { AuthMiddleware } from "../middleware/auth.js";

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
router.use(AuthMiddleware.verifyToken as any);

// Admin-only routes
router.post(
  "/",

  QuizQuestionController.createQuizQuestion
);
router.put(
  "/:id",

  QuizQuestionController.updateQuizQuestion
);
router.delete(
  "/:id",

  QuizQuestionController.deleteQuizQuestion
);

export default router;
