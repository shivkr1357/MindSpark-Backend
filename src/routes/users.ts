import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import {
  AuthMiddleware,
  RoleMiddleware,
  ValidationMiddleware,
} from "../middleware/index.js";
import { AuthenticatedRequestHandler } from "../types/index.js";

const router = Router();
const userController = new UserController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// User profile routes (authenticated users)
router.get("/profile", userController.getProfile as any);
router.put("/profile", userController.updateProfile as any);
router.put("/preferences", userController.updatePreferences as any);
router.get("/stats", userController.getUserStats as any);
router.put("/stats", userController.updateStats as any);

// Admin-only routes
router.get(
  "/",
  ValidationMiddleware.validatePagination(),
  RoleMiddleware.requireAdmin as any,
  userController.getAllUsers as any
);

router.get(
  "/search",
  ValidationMiddleware.validatePagination(),
  RoleMiddleware.requireAdmin as any,
  userController.searchUsers as any
);

router.get(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  RoleMiddleware.requireAdmin as any,
  userController.getUserById as any
);

router.put(
  "/:id/role",
  ValidationMiddleware.validateObjectId("id"),
  RoleMiddleware.requireAdmin as any,
  userController.updateUserRole as any
);

router.delete(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  RoleMiddleware.requireAdmin as any,
  userController.deleteUser as any
);

export default router;
