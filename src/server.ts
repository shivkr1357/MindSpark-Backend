import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeFirebase } from "./config/firebase.js";
import { validateR2Config } from "./config/cloudflare.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize services
const initializeServices = async (): Promise<void> => {
  try {
    console.log("🚀 Initializing MindSpark Backend...");

    // Initialize Firebase
    initializeFirebase();

    // Validate Cloudflare R2 configuration
    if (!validateR2Config()) {
      console.warn(
        "⚠️ Cloudflare R2 configuration is incomplete. File uploads may not work.",
      );
    }

    // Connect to MongoDB
    await connectDB();

    console.log("✅ All services initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize services:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    await initializeServices();

    app.listen(PORT, () => {
      console.log(`🎉 MindSpark Backend server is running on port ${PORT}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api/v1`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();
