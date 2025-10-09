import { Module, type IModule } from "../models/Module.js";

export interface CreateModuleRequest {
  syllabusId: string;
  title: string;
  description?: string;
  order: number;
  duration?: string;
  createdBy: string;
}

export interface UpdateModuleRequest {
  title?: string;
  description?: string;
  order?: number;
  duration?: string;
  isActive?: boolean;
}

export class ModuleService {
  /**
   * Get all modules for a syllabus
   */
  public async getModulesBySyllabus(syllabusId: string): Promise<IModule[]> {
    try {
      const modules = await Module.find({ syllabusId }).sort({ order: 1 });
      return modules;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw new Error("Failed to fetch modules");
    }
  }

  /**
   * Get module by ID
   */
  public async getModuleById(moduleId: string): Promise<IModule | null> {
    try {
      const module = await Module.findById(moduleId);
      return module;
    } catch (error) {
      console.error("Error fetching module:", error);
      throw new Error("Failed to fetch module");
    }
  }

  /**
   * Create a new module
   */
  public async createModule(data: CreateModuleRequest): Promise<IModule> {
    try {
      const module = await Module.create(data);
      return module.toObject();
    } catch (error) {
      console.error("Error creating module:", error);
      throw new Error("Failed to create module");
    }
  }

  /**
   * Update a module
   */
  public async updateModule(
    moduleId: string,
    data: UpdateModuleRequest
  ): Promise<IModule> {
    try {
      const module = await Module.findByIdAndUpdate(moduleId, data, {
        new: true,
        runValidators: true,
      });

      if (!module) {
        throw new Error("Module not found");
      }

      return module.toObject();
    } catch (error) {
      console.error("Error updating module:", error);
      throw new Error("Failed to update module");
    }
  }

  /**
   * Delete a module
   */
  public async deleteModule(moduleId: string): Promise<void> {
    try {
      const result = await Module.findByIdAndDelete(moduleId);
      if (!result) {
        throw new Error("Module not found");
      }
    } catch (error) {
      console.error("Error deleting module:", error);
      throw new Error("Failed to delete module");
    }
  }

  /**
   * Reorder modules
   */
  public async reorderModules(
    syllabusId: string,
    moduleOrders: Array<{ moduleId: string; order: number }>
  ): Promise<void> {
    try {
      const bulkOps = moduleOrders.map(({ moduleId, order }) => ({
        updateOne: {
          filter: { _id: moduleId, syllabusId },
          update: { order },
        },
      }));

      await Module.bulkWrite(bulkOps);
    } catch (error) {
      console.error("Error reordering modules:", error);
      throw new Error("Failed to reorder modules");
    }
  }
}
