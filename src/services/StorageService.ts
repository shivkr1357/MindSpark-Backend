import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_CONFIG } from "../config/cloudflare.js";
import { FileUploadResponse } from "../types/index.js";
import path from "path";
import crypto from "crypto";

export class StorageService {
  private static instance: StorageService;
  private bucketName: string;
  private publicUrl: string;

  private constructor() {
    this.bucketName = R2_CONFIG.bucketName;
    this.publicUrl = R2_CONFIG.publicUrl;
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Upload a file to Cloudflare R2
   */
  public async uploadFile(
    file: Express.Multer.File,
    folder: string = "uploads",
  ): Promise<FileUploadResponse> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;
      const key = `${folder}/${uniqueFilename}`;

      // Upload file to R2
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      });

      await r2Client.send(uploadCommand);

      // Return file URL and metadata
      const fileUrl = `${this.publicUrl}/${key}`;

      return {
        url: fileUrl,
        filename: uniqueFilename,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      console.error("Error uploading file to R2:", error);
      throw new Error("Failed to upload file");
    }
  }

  /**
   * Delete a file from Cloudflare R2
   */
  public async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const key = this.extractKeyFromUrl(fileUrl);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await r2Client.send(deleteCommand);
    } catch (error) {
      console.error("Error deleting file from R2:", error);
      throw new Error("Failed to delete file");
    }
  }

  /**
   * Generate a presigned URL for file access
   */
  public async generatePresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(r2Client, command, { expiresIn });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      throw new Error("Failed to generate presigned URL");
    }
  }

  /**
   * Extract key from R2 URL
   */
  private extractKeyFromUrl(url: string): string {
    const urlParts = url.split("/");
    return urlParts.slice(-2).join("/"); // Get last two parts (folder/filename)
  }

  /**
   * Validate file type
   */
  public validateFileType(mimetype: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimetype);
  }

  /**
   * Validate file size
   */
  public validateFileSize(size: number, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return size <= maxSizeInBytes;
  }

  /**
   * Get allowed file types for different content types
   */
  public getAllowedFileTypes(contentType: string): string[] {
    const fileTypeMap = {
      lesson: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/avi",
        "video/mov",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      fun: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/avi",
        "video/mov",
      ],
      default: ["image/jpeg", "image/png", "application/pdf", "text/plain"],
    };

    return (
      fileTypeMap[contentType as keyof typeof fileTypeMap] ||
      fileTypeMap.default
    );
  }

  /**
   * Get max file size for different content types
   */
  public getMaxFileSize(contentType: string): number {
    const maxSizeMap = {
      lesson: 50, // 50MB for lesson files
      fun: 10, // 10MB for fun content
      default: 5, // 5MB default
    };

    return (
      maxSizeMap[contentType as keyof typeof maxSizeMap] || maxSizeMap.default
    );
  }
}
