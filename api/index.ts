import type { Request, Response } from "express";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { initializeFirebase } from "../src/config/firebase.js";
import { validateR2Config } from "../src/config/cloudflare.js";

let isInitialized = false;

// Initialize services once
const initializeServices = async (): Promise<void> => {
  if (isInitialized) {
    return;
  }

  try {
    console.log("🚀 Initializing MindSpark Backend for Vercel...");

    // Initialize Firebase
    initializeFirebase();

    // Validate Cloudflare R2 configuration
    if (!validateR2Config()) {
      console.warn(
        "⚠️ Cloudflare R2 configuration is incomplete. File uploads may not work."
      );
    }

    // Connect to MongoDB
    await connectDB();

    isInitialized = true;
    console.log("✅ All services initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize services:", error);
    throw error;
  }
};

// Export the Express app as a serverless function
export default async (req: Request, res: Response) => {
  try {
    await initializeServices();
    return app(req, res);
  } catch (error) {
    console.error("❌ Error handling request:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
