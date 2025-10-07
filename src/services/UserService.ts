import { User } from "../models/User.js";
import { IUser } from "../types/index.js";

export class UserService {
  /**
   * Create or update user from Firebase token
   */
  public async createOrUpdateUser(firebaseUser: {
    uid: string;
    name?: string;
    email: string;
  }): Promise<IUser> {
    try {
      console.log("📝 Creating/updating user with Firebase data:", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name,
      });

      const userData = {
        uid: firebaseUser.uid,
        name:
          firebaseUser.name ||
          firebaseUser.email?.split("@")[0] ||
          "Unknown User",
        email: firebaseUser.email,
      };

      // First try to find by uid, then by email if uid doesn't exist
      let user = await User.findOne({ uid: firebaseUser.uid });

      if (!user) {
        // If no user found by uid, try to find by email
        user = await User.findOne({ email: firebaseUser.email });
      }

      if (user) {
        // Update existing user
        console.log("🔄 Updating existing user:", user._id);
        user.uid = firebaseUser.uid;
        user.name = firebaseUser.name || user.name;
        user.email = firebaseUser.email;
        await user.save();
        console.log("✅ User updated successfully");
      } else {
        // Create new user
        console.log("➕ Creating new user");
        user = await User.create(userData);
        console.log("✅ New user created:", user._id);
      }

      return user.toObject();
    } catch (error) {
      console.error("❌ Error creating/updating user:", error);
      throw new Error("Failed to create or update user");
    }
  }

  /**
   * Get user by UID
   */
  public async getUserByUid(uid: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ uid });
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error getting user by UID:", error);
      throw new Error("Failed to get user");
    }
  }

  /**
   * Get user by email
   */
  public async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email });
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new Error("Failed to get user");
    }
  }

  /**
   * Update user profile
   */
  public async updateUserProfile(
    uid: string,
    updateData: Partial<IUser>
  ): Promise<IUser> {
    try {
      const user = await User.findOneAndUpdate({ uid }, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.toObject();
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Failed to update user profile");
    }
  }

  /**
   * Update user statistics
   */
  public async updateUserStats(
    uid: string,
    statsUpdate: Partial<IUser["stats"]>
  ): Promise<IUser> {
    try {
      const user = await User.findOneAndUpdate(
        { uid },
        { $inc: statsUpdate },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user.toObject();
    } catch (error) {
      console.error("Error updating user stats:", error);
      throw new Error("Failed to update user statistics");
    }
  }

  /**
   * Get user role
   */
  public async getUserRole(uid: string): Promise<string> {
    try {
      const user = await User.findOne({ uid }).select("role");
      return user?.role || "student";
    } catch (error) {
      console.error("Error getting user role:", error);
      return "student";
    }
  }

  /**
   * Check if user is admin
   */
  public async isAdmin(uid: string): Promise<boolean> {
    try {
      const role = await this.getUserRole(uid);
      return role === "admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }

  /**
   * Get all users (admin only)
   */
  public async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUser[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        User.countDocuments(),
      ]);

      return { users, total };
    } catch (error) {
      console.error("Error getting all users:", error);
      throw new Error("Failed to get users");
    }
  }

  /**
   * Delete user
   */
  public async deleteUser(uid: string): Promise<void> {
    try {
      const result = await User.findOneAndDelete({ uid });
      if (!result) {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }

  /**
   * Update user preferences
   */
  public async updateUserPreferences(
    uid: string,
    preferences: Partial<IUser["preferences"]>
  ): Promise<IUser> {
    try {
      const user = await User.findOneAndUpdate(
        { uid },
        { preferences },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user.toObject();
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw new Error("Failed to update user preferences");
    }
  }
}
