import { Router } from "express";
import { SubjectController } from "../controllers/SubjectController.js";
import {
  AuthMiddleware,
  RoleMiddleware,
  ValidationMiddleware,
} from "../middleware/index.js";

const router = Router();
const subjectController = new SubjectController();

// Apply authentication middleware to all routes (disabled for testing)
router.use(AuthMiddleware.verifyToken as any);

// Apply validation middleware
router.post(
  "/",
  ValidationMiddleware.validateCreateSubject(),
  subjectController.createSubject as any
);

router.get(
  "/",
  ValidationMiddleware.validatePagination(),
  subjectController.getAllSubjects as any
);

router.get(
  "/search",
  ValidationMiddleware.validatePagination(),
  subjectController.searchSubjects as any
);

router.get("/stats", subjectController.getSubjectStats as any);

router.get(
  "/difficulty/:difficulty",
  ValidationMiddleware.validatePagination(),
  subjectController.getSubjectsByDifficulty as any
);

router.get(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  subjectController.getSubjectById as any
);

router.put(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  subjectController.updateSubject as any
);

router.delete(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  RoleMiddleware.requireAdmin as any,
  subjectController.deleteSubject as any
);

export default router;
