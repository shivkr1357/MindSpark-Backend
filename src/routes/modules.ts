import { Router } from "express";
import { ModuleController } from "../controllers/ModuleController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();
const moduleController = new ModuleController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// Get all modules for a syllabus
router.get(
  "/syllabus/:syllabusId",
  moduleController.getModulesBySyllabus as any
);

// Get module by ID
router.get("/:id", moduleController.getModuleById as any);

// Create a new module
router.post("/:syllabusId", moduleController.createModule as any);

// Update a module
router.put("/:id", moduleController.updateModule as any);

// Delete a module
router.delete("/:id", moduleController.deleteModule as any);

// Reorder modules
router.post("/:syllabusId/reorder", moduleController.reorderModules as any);

export default router;
