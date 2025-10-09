import { Request, Response } from "express";
import { ModuleService } from "../services/ModuleService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class ModuleController {
  private moduleService: ModuleService;

  constructor() {
    this.moduleService = new ModuleService();
  }

  /**
   * Get all modules for a syllabus
   */
  public getModulesBySyllabus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { syllabusId } = req.params;
      const modules = await this.moduleService.getModulesBySyllabus(syllabusId);

      res.status(200).json({
        success: true,
        data: modules,
      });
    } catch (error) {
      console.error("Get modules error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch modules",
      });
    }
  };

  /**
   * Get module by ID
   */
  public getModuleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const module = await this.moduleService.getModuleById(id);

      if (!module) {
        res.status(404).json({
          success: false,
          error: "Module not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: module,
      });
    } catch (error) {
      console.error("Get module error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch module",
      });
    }
  };

  /**
   * Create a new module
   */
  public createModule = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { syllabusId } = req.params;
      const moduleData = {
        ...req.body,
        syllabusId,
        createdBy: req.user?.uid || "system",
      };

      const module = await this.moduleService.createModule(moduleData);

      res.status(201).json({
        success: true,
        data: module,
        message: "Module created successfully",
      });
    } catch (error) {
      console.error("Create module error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create module",
      });
    }
  };

  /**
   * Update a module
   */
  public updateModule = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const module = await this.moduleService.updateModule(id, req.body);

      res.status(200).json({
        success: true,
        data: module,
        message: "Module updated successfully",
      });
    } catch (error) {
      console.error("Update module error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update module",
      });
    }
  };

  /**
   * Delete a module
   */
  public deleteModule = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.moduleService.deleteModule(id);

      res.status(200).json({
        success: true,
        message: "Module deleted successfully",
      });
    } catch (error) {
      console.error("Delete module error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete module",
      });
    }
  };

  /**
   * Reorder modules
   */
  public reorderModules = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { syllabusId } = req.params;
      const { moduleOrders } = req.body;

      await this.moduleService.reorderModules(syllabusId, moduleOrders);

      res.status(200).json({
        success: true,
        message: "Modules reordered successfully",
      });
    } catch (error) {
      console.error("Reorder modules error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to reorder modules",
      });
    }
  };
}
