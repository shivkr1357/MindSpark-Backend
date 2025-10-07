import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController.js";
import {
  AuthMiddleware,
  RoleMiddleware,
  ValidationMiddleware,
} from "../middleware/index.js";

const router = Router();
const questionController = new QuestionController();

// Apply authentication middleware to all routes (disabled for testing)
router.use(AuthMiddleware.verifyToken as any);

// Apply validation middleware
router.post(
  "/:subjectId",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validateCreateQuestion(),

  questionController.createQuestion as any
);

router.get(
  "/:subjectId",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.validateDifficulty(),
  questionController.getQuestionsBySubject as any
);

router.get(
  "/:subjectId/random",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validateDifficulty(),
  questionController.getRandomQuestions as any
);

router.get(
  "/:subjectId/category/:category",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validatePagination(),
  questionController.getQuestionsByCategory as any
);

router.get(
  "/:subjectId/difficulty/:difficulty",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validatePagination(),
  questionController.getQuestionsByDifficulty as any
);

router.get(
  "/:subjectId/search",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validatePagination(),
  questionController.searchQuestions as any
);

router.get(
  "/:subjectId/stats",
  ValidationMiddleware.validateObjectId("subjectId"),
  questionController.getQuestionStats as any
);

router.get(
  "/",
  ValidationMiddleware.validatePagination(),

  questionController.getAllQuestions as any
);

router.get(
  "/id/:id",
  ValidationMiddleware.validateObjectId("id"),
  questionController.getQuestionById as any
);

router.put(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  questionController.updateQuestion as any
);

router.delete(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  questionController.deleteQuestion as any
);

export default router;
