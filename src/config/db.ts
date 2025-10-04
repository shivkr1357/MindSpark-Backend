import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    // Use MONGODB_URI if available, otherwise construct from individual components
    const mongoURI =
      process.env.MONGODB_URI ||
      `mongodb+srv://${process.env.MONGODB_USER}:${
        process.env.MONGODB_PASSWORD
      }@cluster0.ru9s9.mongodb.net/${
        process.env.MONGODB_DATABASE || "mindspark"
      }?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB disconnected successfully");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error);
    throw error;
  }
};
