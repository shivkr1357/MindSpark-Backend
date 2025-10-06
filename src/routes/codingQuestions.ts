import { Router } from "express";
import { CodingQuestionController } from "../controllers/CodingQuestionController.js";
import { AuthMiddleware } from "../middleware/index.js";

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
router.use(AuthMiddleware.verifyToken as any);

// Admin-only routes
router.post(
  "/",

  CodingQuestionController.createCodingQuestion
);
router.put(
  "/:id",

  CodingQuestionController.updateCodingQuestion
);
router.delete(
  "/:id",

  CodingQuestionController.deleteCodingQuestion
);

export default router;
