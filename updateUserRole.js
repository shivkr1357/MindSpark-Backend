import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Simple script to update a user's role to admin
async function updateUserRole(email, role = "admin") {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/mindspark"
    );
    console.log("✅ Connected to MongoDB");

    // Define User schema (simplified)
    const userSchema = new mongoose.Schema(
      {
        uid: String,
        email: String,
        name: String,
        role: { type: String, enum: ["student", "admin"], default: "student" },
      },
      { timestamps: true }
    );

    const User = mongoose.model("User", userSchema);

    // Update user role
    const result = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: role },
      { new: true, upsert: false }
    );

    if (result) {
      console.log(`✅ Successfully updated user ${email} to role: ${role}`);
      console.log("User details:", {
        email: result.email,
        name: result.name,
        role: result.role,
        uid: result.uid,
      });
    } else {
      console.log(`❌ User with email ${email} not found in database`);
      console.log(
        "💡 Make sure you have logged in at least once to create the user record"
      );
    }
  } catch (error) {
    console.error("❌ Error updating user role:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log("Usage: node updateUserRole.js <email>");
  console.log("Example: node updateUserRole.js admin@mindspark.com");
  process.exit(1);
}

updateUserRole(email);
