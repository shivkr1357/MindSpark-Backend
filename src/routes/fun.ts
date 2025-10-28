import { Router } from "express";
import { FunContentController } from "../controllers/FunContentController.js";
import {
  AuthMiddleware,
  RoleMiddleware,
  ValidationMiddleware,
} from "../middleware/index.js";
import { AuthenticatedRequestHandler } from "../types/index.js";

const router = Router();
const funContentController = new FunContentController();

// Apply authentication middleware to all routes (disabled for testing)
router.use(AuthMiddleware.verifyToken as any);

// Apply validation middleware
router.post(
  "/:subjectId?",
  ValidationMiddleware.validateObjectId("subjectId").concat(
    ValidationMiddleware.validateCreateFunContent()
  ),
  RoleMiddleware.requireAdmin as any,
  funContentController.createFunContent as any
);

router.get(
  "/",
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.validateContentType(),
  ValidationMiddleware.validateDifficulty(),
  funContentController.getFunContent as any
);

router.get(
  "/type/:type",
  ValidationMiddleware.validateContentType(),
  ValidationMiddleware.validatePagination(),
  funContentController.getFunContentByType as any
);

router.get(
  "/type/:type/random",
  ValidationMiddleware.validateContentType(),
  funContentController.getRandomFunContentByType as any
);

router.get(
  "/difficulty/:difficulty",
  ValidationMiddleware.validatePagination(),
  funContentController.getFunContentByDifficulty as any
);

router.get(
  "/trending",
  ValidationMiddleware.validatePagination(),
  funContentController.getTrendingFunContent as any
);

router.get(
  "/search",
  ValidationMiddleware.validatePagination(),
  funContentController.searchFunContent as any
);

router.get(
  "/stats",
  RoleMiddleware.requireAdmin as any,
  funContentController.getFunContentStats as any
);

router.get(
  "/:subjectId",
  ValidationMiddleware.validateObjectId("subjectId"),
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.validateContentType(),
  ValidationMiddleware.validateDifficulty(),
  funContentController.getFunContentBySubject as any
);

router.get(
  "/id/:id",
  ValidationMiddleware.validateObjectId("id"),
  funContentController.getFunContentById as any
);

router.put(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  RoleMiddleware.requireAdmin as any,
  funContentController.updateFunContent as any
);

router.delete(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  RoleMiddleware.requireAdmin as any,
  funContentController.deleteFunContent as any
);

export default router;
