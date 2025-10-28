import { Router } from "express";
import { QuestionnaireController } from "../controllers/QuestionnaireController.js";
import {
  AuthMiddleware,
  RoleMiddleware,
  ValidationMiddleware,
} from "../middleware/index.js";
import { AuthenticatedRequestHandler } from "../types/index.js";

const router = Router();
const questionnaireController = new QuestionnaireController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// Create questionnaire (Admin only)
router.post(
  "/",
  ValidationMiddleware.validateCreateQuestionnaire(),
  RoleMiddleware.requireAdmin as any,
  questionnaireController.createQuestionnaire as any
);

// Generate AI questionnaire (Admin only)
router.post(
  "/ai-generate",
  ValidationMiddleware.validateAIGenerateQuestionnaire(),
  RoleMiddleware.requireAdmin as any,
  questionnaireController.generateAIGuestionnaire as any
);

// Get all questionnaires with filters
router.get(
  "/",
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.validateDifficulty(),
  questionnaireController.getQuestionnaires as any
);

// Get questionnaire by ID
router.get(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  questionnaireController.getQuestionnaireById as any
);

// Get questionnaires by subject
router.get(
  "/subject/:subjectId",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validatePagination(),
  questionnaireController.getQuestionnairesBySubject as any
);

// Get AI-generated questionnaires
router.get(
  "/ai/generated",
  ValidationMiddleware.validatePagination(),
  questionnaireController.getAIGeneratedQuestionnaires as any
);

// Get questionnaire statistics (Admin only)
router.get(
  "/stats/overview",
  RoleMiddleware.requireAdmin as any,
  questionnaireController.getQuestionnaireStats as any
);

// Update questionnaire (Admin only)
router.put(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  ValidationMiddleware.validateUpdateQuestionnaire(),
  RoleMiddleware.requireAdmin as any,
  questionnaireController.updateQuestionnaire as any
);

// Add question to questionnaire (Admin only)
router.post(
  "/:id/questions",
  ValidationMiddleware.validateObjectId("id"),
  ValidationMiddleware.validateAddQuestion(),
  RoleMiddleware.requireAdmin as any,
  questionnaireController.addQuestionToQuestionnaire as any
);

// Delete questionnaire (Admin only)
router.delete(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  RoleMiddleware.requireAdmin as any,
  questionnaireController.deleteQuestionnaire as any
);

// Debug route to check database status
router.get("/debug/status", questionnaireController.checkDatabaseStatus as any);

export default router;
