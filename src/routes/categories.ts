import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.js";
import {
  AuthMiddleware,
  RoleMiddleware,
  ValidationMiddleware,
} from "../middleware/index.js";

const router = Router();
const categoryController = new CategoryController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// Public routes (authenticated users)
router.get(
  "/",
  ValidationMiddleware.validatePagination(),
  categoryController.getAllCategories as any
);

router.get(
  "/active",
  ValidationMiddleware.validatePagination(),
  categoryController.getActiveCategories as any
);

router.get(
  "/top-level",
  ValidationMiddleware.validatePagination(),
  categoryController.getTopLevelCategories as any
);

router.get(
  "/search",
  ValidationMiddleware.validatePagination(),
  categoryController.searchCategories as any
);

router.get("/slug/:slug", categoryController.getCategoryBySlug as any);

router.get(
  "/:id/subcategories",
  ValidationMiddleware.validateObjectId("id"),
  ValidationMiddleware.validatePagination(),
  categoryController.getSubcategories as any
);

router.get(
  "/:id",
  ValidationMiddleware.validateObjectId("id"),
  categoryController.getCategoryById as any
);

// Admin routes
router.post(
  "/",
  RoleMiddleware.requireAdmin as any,
  ValidationMiddleware.validateCreateCategory(),
  categoryController.createCategory as any
);

router.put(
  "/:id",
  RoleMiddleware.requireAdmin as any,
  ValidationMiddleware.validateObjectId("id"),
  ValidationMiddleware.validateUpdateCategory(),
  categoryController.updateCategory as any
);

router.delete(
  "/:id",
  RoleMiddleware.requireAdmin as any,
  ValidationMiddleware.validateObjectId("id"),
  categoryController.deleteCategory as any
);

router.get(
  "/admin/stats",
  RoleMiddleware.requireAdmin as any,
  categoryController.getCategoryStats as any
);

router.post(
  "/admin/reorder",
  RoleMiddleware.requireAdmin as any,
  categoryController.reorderCategories as any
);

export default router;
