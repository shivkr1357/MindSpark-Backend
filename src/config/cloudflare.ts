import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const R2_CONFIG = {
  bucketName: process.env.R2_BUCKET_NAME || "",
  publicUrl: process.env.R2_PUBLIC_URL || "",
  accountId: process.env.R2_ACCOUNT_ID || "",
};

export const validateR2Config = (): boolean => {
  const requiredEnvVars = [
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_ACCOUNT_ID",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    console.error("❌ Missing required R2 environment variables:", missingVars);
    return false;
  }

  console.log("✅ Cloudflare R2 configuration validated");
  return true;
};
