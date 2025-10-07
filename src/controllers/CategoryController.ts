import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Create a new category (Admin only)
   */
  public createCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const {
        name,
        slug,
        description,
        icon,
        color,
        order,
        isActive,
        parentCategoryId,
      } = req.body;
      const createdBy = req.user?.uid;

      if (!createdBy) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const category = await this.categoryService.createCategory(
        {
          name,
          slug,
          description,
          icon,
          color,
          order,
          isActive,
          parentCategoryId,
        },
        createdBy
      );

      res.status(201).json({
        success: true,
        data: category,
        message: "Category created successfully",
      });
    } catch (error) {
      console.error("Create category error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create category",
      });
    }
  };

  /**
   * Get all categories
   */
  public getAllCategories = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const { categories, total } = await this.categoryService.getAllCategories(
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all categories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get categories",
      });
    }
  };

  /**
   * Get active categories
   */
  public getActiveCategories = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const { categories, total } =
        await this.categoryService.getActiveCategories(page, limit);

      res.status(200).json({
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get active categories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get active categories",
      });
    }
  };

  /**
   * Get category by ID
   */
  public getCategoryById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);

      if (!category) {
        res.status(404).json({
          success: false,
          error: "Category not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error("Get category by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get category",
      });
    }
  };

  /**
   * Get category by slug
   */
  public getCategoryBySlug = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { slug } = req.params;
      const category = await this.categoryService.getCategoryBySlug(slug);

      if (!category) {
        res.status(404).json({
          success: false,
          error: "Category not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error("Get category by slug error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get category",
      });
    }
  };

  /**
   * Update category (Admin only)
   */
  public updateCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await this.categoryService.updateCategory(
        id,
        updateData
      );

      res.status(200).json({
        success: true,
        data: category,
        message: "Category updated successfully",
      });
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update category",
      });
    }
  };

  /**
   * Delete category (Admin only)
   */
  public deleteCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete category",
      });
    }
  };

  /**
   * Search categories
   */
  public searchCategories = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { q: query } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!query) {
        res.status(400).json({
          success: false,
          error: "Search query is required",
        });
        return;
      }

      const { categories, total } = await this.categoryService.searchCategories(
        query as string,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Search categories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search categories",
      });
    }
  };

  /**
   * Get subcategories
   */
  public getSubcategories = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const { categories, total } = await this.categoryService.getSubcategories(
        id,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get subcategories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get subcategories",
      });
    }
  };

  /**
   * Get top-level categories
   */
  public getTopLevelCategories = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const { categories, total } =
        await this.categoryService.getTopLevelCategories(page, limit);

      res.status(200).json({
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get top-level categories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get top-level categories",
      });
    }
  };

  /**
   * Get category statistics (Admin only)
   */
  public getCategoryStats = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const stats = await this.categoryService.getCategoryStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Get category stats error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get category statistics",
      });
    }
  };

  /**
   * Reorder categories (Admin only)
   */
  public reorderCategories = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { categoryIds } = req.body;

      if (!Array.isArray(categoryIds)) {
        res.status(400).json({
          success: false,
          error: "categoryIds must be an array",
        });
        return;
      }

      const result = await this.categoryService.reorderCategories(categoryIds);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Reorder categories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to reorder categories",
      });
    }
  };
}
