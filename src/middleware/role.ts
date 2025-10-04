import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";

export class RoleMiddleware {
  /**
   * Check if user has admin role
   */
  public static requireAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "Admin access required",
      });
      return;
    }

    next();
  }

  /**
   * Check if user has student role
   */
  public static requireStudent(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    if (req.user.role !== "student" && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "Student access required",
      });
      return;
    }

    next();
  }

  /**
   * Check if user owns the resource or is admin
   */
  public static requireOwnershipOrAdmin(ownerField: string = "createdBy") {
    return (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction,
    ): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      // Admin can access everything
      if (req.user.role === "admin") {
        next();
        return;
      }

      // Check if user owns the resource
      const resourceOwnerId = req.params[ownerField] || req.body[ownerField];
      if (resourceOwnerId && resourceOwnerId === req.user.uid) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        error: "Access denied. You can only access your own resources.",
      });
    };
  }

  /**
   * Check if user can access resource (owner or admin)
   */
  public static canAccessResource(
    ownerId: string,
    user: { role: string; uid: string },
  ): boolean {
    return user.role === "admin" || user.uid === ownerId;
  }

  /**
   * Middleware to check if user can modify resource
   */
  public static requireResourceAccess(_ownerField: string = "createdBy") {
    return async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({
            success: false,
            error: "Authentication required",
          });
          return;
        }

        const resourceId =
          req.params.id ||
          req.params.subjectId ||
          req.params.syllabusId ||
          req.params.questionId ||
          req.params.contentId;

        if (!resourceId) {
          res.status(400).json({
            success: false,
            error: "Resource ID required",
          });
          return;
        }

        // For now, we'll allow the request to continue and let the controller handle the ownership check
        // This is because we need to know which model to query based on the route
        next();
      } catch (error) {
        console.error("Resource access middleware error:", error);
        res.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    };
  }
}
