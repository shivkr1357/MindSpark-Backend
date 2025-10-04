import { Response } from "express";
import { UserService } from "../services/UserService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get current user profile
   */
  public getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const user = await this.userService.getUserByUid(req.user?.uid || "");

      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user profile",
      });
    }
  };

  /**
   * Update user profile
   */
  public updateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { name, avatar } = req.body;
      const updateData: Partial<{ name: string; avatar: string }> = {};

      if (name) updateData.name = name;
      if (avatar) updateData.avatar = avatar;

      const user = await this.userService.updateUserProfile(
        req.user?.uid || "",
        updateData,
      );

      res.status(200).json({
        success: true,
        data: user,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  /**
   * Update user preferences
   */
  public updatePreferences = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { preferences } = req.body;

      const user = await this.userService.updateUserPreferences(
        req.user?.uid || "",
        preferences,
      );

      res.status(200).json({
        success: true,
        data: user,
        message: "Preferences updated successfully",
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update preferences",
      });
    }
  };

  /**
   * Get user statistics
   */
  public getUserStats = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const user = await this.userService.getUserByUid(req.user?.uid || "");

      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      // Calculate additional stats
      const stats = {
        ...user.stats,
        accuracy: user.stats?.totalQuestions
          ? Math.round(
              (user.stats.correctAnswers / user.stats.totalQuestions) * 100,
            )
          : 0,
        completionRate: user.stats?.totalLessons
          ? Math.round(
              (user.stats.completedLessons / user.stats.totalLessons) * 100,
            )
          : 0,
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user statistics",
      });
    }
  };

  /**
   * Update user statistics
   */
  public updateStats = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { stats } = req.body;

      const user = await this.userService.updateUserStats(
        req.user?.uid || "",
        stats,
      );

      res.status(200).json({
        success: true,
        data: user,
        message: "Statistics updated successfully",
      });
    } catch (error) {
      console.error("Update stats error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update statistics",
      });
    }
  };

  /**
   * Get user by ID (Admin only)
   */
  public getUserById = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserByUid(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user",
      });
    }
  };

  /**
   * Get all users (Admin only)
   */
  public getAllUsers = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { users, total } = await this.userService.getAllUsers(page, limit);

      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get users",
      });
    }
  };

  /**
   * Update user role (Admin only)
   */
  public updateUserRole = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!["student", "admin"].includes(role)) {
        res.status(400).json({
          success: false,
          error: "Invalid role. Must be either \"student\" or \"admin\"",
        });
        return;
      }

      const user = await this.userService.updateUserProfile(id, { role });

      res.status(200).json({
        success: true,
        data: user,
        message: "User role updated successfully",
      });
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update user role",
      });
    }
  };

  /**
   * Delete user (Admin only)
   */
  public deleteUser = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (id === req.user?.uid || "") {
        res.status(400).json({
          success: false,
          error: "You cannot delete your own account",
        });
        return;
      }

      await this.userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
      });
    }
  };

  /**
   * Search users (Admin only)
   */
  public searchUsers = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { q: query } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        res.status(400).json({
          success: false,
          error: "Search query is required",
        });
        return;
      }

      // For now, we'll implement a simple search
      // In a real application, you might want to use a more sophisticated search
      const { users } = await this.userService.getAllUsers(page, limit);

      const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes((query as string).toLowerCase()) ||
          user.email.toLowerCase().includes((query as string).toLowerCase()),
      );

      res.status(200).json({
        success: true,
        data: filteredUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / limit),
        },
      });
    } catch (error) {
      console.error("Search users error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search users",
      });
    }
  };
}
