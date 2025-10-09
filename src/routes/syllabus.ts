import { Router } from "express";
import { SyllabusController } from "../controllers/SyllabusController.js";
import {
  AuthMiddleware,
  RoleMiddleware,
  ValidationMiddleware,
} from "../middleware/index.js";

const router = Router();
const syllabusController = new SyllabusController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// Apply validation middleware
router.post(
  "/:subjectId",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validateCreateSyllabus(),
  syllabusController.createSyllabus as any
);

router.get(
  "/:subjectId",
  ValidationMiddleware.validateObjectId("subjectId"),
  syllabusController.getSyllabusBySubject as any
);

router.get(
  "/id/:id",
  ValidationMiddleware.validateObjectId("id"),
  syllabusController.getSyllabusById as any
);

router.put(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  syllabusController.updateSyllabus as any
);

router.delete(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  syllabusController.deleteSyllabus as any
);

router.get(
  "/",
  ValidationMiddleware.validatePagination(),
  syllabusController.getAllSyllabi as any
);

router.get(
  "/difficulty/:difficulty",
  ValidationMiddleware.validatePagination(),
  syllabusController.getSyllabiByDifficulty as any
);

export default router;
