import { Router } from "express";
import { CodingQuestionController } from "../controllers/CodingQuestionController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// Public routes
router.get("/", CodingQuestionController.getAllCodingQuestions);
router.get(
  "/difficulty/:difficulty",
  CodingQuestionController.getCodingQuestionsByDifficulty
);
router.get(
  "/language/:language",
  CodingQuestionController.getCodingQuestionsByLanguage
);
router.get(
  "/category/:category",
  CodingQuestionController.getCodingQuestionsByCategory
);
router.get("/:id", CodingQuestionController.getCodingQuestionById);
router.get("/:id/test-cases", CodingQuestionController.getPublicTestCases);

// Protected routes (require authentication)
router.use(authenticateToken);

// Admin-only routes
router.post(
  "/",
  requireRole("admin"),
  CodingQuestionController.createCodingQuestion
);
router.put(
  "/:id",
  requireRole("admin"),
  CodingQuestionController.updateCodingQuestion
);
router.delete(
  "/:id",
  requireRole("admin"),
  CodingQuestionController.deleteCodingQuestion
);

export default router;
