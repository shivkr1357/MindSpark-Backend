import { Category } from "../models/Category.js";
import { ICategory, CreateCategoryRequest } from "../types/index.js";

export class CategoryService {
  /**
   * Create a new category
   */
  public async createCategory(
    categoryData: CreateCategoryRequest,
    createdBy: string
  ): Promise<ICategory> {
    try {
      const category = new Category({
        ...categoryData,
        createdBy,
      });

      await category.save();
      return category.toObject();
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  }

  /**
   * Get all categories
   */
  public async getAllCategories(
    page: number = 1,
    limit: number = 50
  ): Promise<{ categories: ICategory[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        Category.find()
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Category.countDocuments(),
      ]);

      return { categories, total };
    } catch (error) {
      console.error("Error getting all categories:", error);
      throw new Error("Failed to get categories");
    }
  }

  /**
   * Get active categories
   */
  public async getActiveCategories(
    page: number = 1,
    limit: number = 50
  ): Promise<{ categories: ICategory[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        Category.find({ isActive: true })
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Category.countDocuments({ isActive: true }),
      ]);

      return { categories, total };
    } catch (error) {
      console.error("Error getting active categories:", error);
      throw new Error("Failed to get active categories");
    }
  }

  /**
   * Get category by ID
   */
  public async getCategoryById(categoryId: string): Promise<ICategory | null> {
    try {
      const category = await Category.findById(categoryId).lean();
      return category;
    } catch (error) {
      console.error("Error getting category by ID:", error);
      throw new Error("Failed to get category");
    }
  }

  /**
   * Get category by slug
   */
  public async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    try {
      const category = await Category.findOne({ slug }).lean();
      return category;
    } catch (error) {
      console.error("Error getting category by slug:", error);
      throw new Error("Failed to get category");
    }
  }

  /**
   * Update category
   */
  public async updateCategory(
    categoryId: string,
    updateData: Partial<CreateCategoryRequest>
  ): Promise<ICategory> {
    try {
      const category = await Category.findByIdAndUpdate(
        categoryId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!category) {
        throw new Error("Category not found");
      }

      return category.toObject();
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category");
    }
  }

  /**
   * Delete category
   */
  public async deleteCategory(categoryId: string): Promise<void> {
    try {
      const result = await Category.findByIdAndDelete(categoryId);
      if (!result) {
        throw new Error("Category not found");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }

  /**
   * Search categories
   */
  public async searchCategories(
    query: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ categories: ICategory[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const searchQuery = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { slug: { $regex: query, $options: "i" } },
        ],
      };

      const [categories, total] = await Promise.all([
        Category.find(searchQuery)
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Category.countDocuments(searchQuery),
      ]);

      return { categories, total };
    } catch (error) {
      console.error("Error searching categories:", error);
      throw new Error("Failed to search categories");
    }
  }

  /**
   * Get subcategories
   */
  public async getSubcategories(
    parentCategoryId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ categories: ICategory[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        Category.find({ parentCategoryId })
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Category.countDocuments({ parentCategoryId }),
      ]);

      return { categories, total };
    } catch (error) {
      console.error("Error getting subcategories:", error);
      throw new Error("Failed to get subcategories");
    }
  }

  /**
   * Get top-level categories (without parent)
   */
  public async getTopLevelCategories(
    page: number = 1,
    limit: number = 50
  ): Promise<{ categories: ICategory[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        Category.find({
          $or: [
            { parentCategoryId: null },
            { parentCategoryId: { $exists: false } },
          ],
          isActive: true,
        })
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Category.countDocuments({
          $or: [
            { parentCategoryId: null },
            { parentCategoryId: { $exists: false } },
          ],
          isActive: true,
        }),
      ]);

      return { categories, total };
    } catch (error) {
      console.error("Error getting top-level categories:", error);
      throw new Error("Failed to get top-level categories");
    }
  }

  /**
   * Get category statistics
   */
  public async getCategoryStats(): Promise<{
    totalCategories: number;
    activeCategories: number;
    topLevelCategories: number;
  }> {
    try {
      const [totalCategories, activeCategories, topLevelCategories] =
        await Promise.all([
          Category.countDocuments(),
          Category.countDocuments({ isActive: true }),
          Category.countDocuments({
            $or: [
              { parentCategoryId: null },
              { parentCategoryId: { $exists: false } },
            ],
          }),
        ]);

      return {
        totalCategories,
        activeCategories,
        topLevelCategories,
      };
    } catch (error) {
      console.error("Error getting category stats:", error);
      throw new Error("Failed to get category statistics");
    }
  }

  /**
   * Reorder categories
   */
  public async reorderCategories(
    categoryIds: string[]
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updatePromises = categoryIds.map((id, index) =>
        Category.findByIdAndUpdate(id, { order: index })
      );

      await Promise.all(updatePromises);

      return {
        success: true,
        message: "Categories reordered successfully",
      };
    } catch (error) {
      console.error("Error reordering categories:", error);
      throw new Error("Failed to reorder categories");
    }
  }
}
