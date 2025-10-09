import { Response, NextFunction } from "express";
import { verifyFirebaseToken } from "../config/firebase.js";
import { UserService } from "../services/UserService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class AuthMiddleware {
  private static userService = new UserService();

  /**
   * Verify Firebase token and attach user to request
   */
  public static async verifyToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          error: "No token provided or invalid format",
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify Firebase token
      const decodedToken = await verifyFirebaseToken(token);

      console.log("🔑 Firebase token verified for user:", {
        uid: decodedToken.uid,
        email: decodedToken.email,
      });

      // Get or create user from database
      const user = await AuthMiddleware.userService.createOrUpdateUser({
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        name:
          decodedToken.name ||
          (decodedToken as any).displayName ||
          decodedToken.email?.split("@")[0] ||
          "Unknown User",
      });

      // Attach user data to request
      req.user = user;
      req.firebaseUser = {
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        name:
          decodedToken.name ||
          (decodedToken as any).displayName ||
          decodedToken.email?.split("@")[0] ||
          "Unknown User",
      };

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
  }

  /**
   * Optional authentication - doesn't fail if no token provided
   */
  public static async optionalAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // No token provided, continue without authentication
        next();
        return;
      }

      const token = authHeader.substring(7);
      const decodedToken = await verifyFirebaseToken(token);

      const user = await AuthMiddleware.userService.createOrUpdateUser({
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        name:
          decodedToken.name ||
          (decodedToken as any).displayName ||
          decodedToken.email?.split("@")[0] ||
          "Unknown User",
      });

      req.user = user;
      req.firebaseUser = {
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        name:
          decodedToken.name ||
          (decodedToken as any).displayName ||
          decodedToken.email?.split("@")[0] ||
          "Unknown User",
      };

      next();
    } catch (error) {
      console.error("Optional auth middleware error:", error);
      // Continue without authentication on error
      next();
    }
  }

  /**
   * Check if user is authenticated
   */
  public static requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }
    next();
  }
}
