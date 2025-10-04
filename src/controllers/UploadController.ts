import { Request, Response } from "express";
import { StorageService } from "../services/StorageService.js";
import { AuthenticatedRequest } from "../types/index.js";
import multer from "multer";

export class UploadController {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  /**
   * Configure multer for file uploads
   */
  public getUploadMiddleware(contentType: string = "default") {
    const allowedTypes = this.storageService.getAllowedFileTypes(contentType);
    const maxSize = this.storageService.getMaxFileSize(contentType);

    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: maxSize * 1024 * 1024, // Convert MB to bytes
      },
      fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              `File type ${
                file.mimetype
              } is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
            ),
          );
        }
      },
    });
  }

  /**
   * Upload a single file
   */
  public uploadFile = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "No file provided",
        });
        return;
      }

      const { contentType = "default" } = req.body;
      const folder = this.getFolderName(contentType);

      const result = await this.storageService.uploadFile(req.file, folder);

      res.status(200).json({
        success: true,
        data: result,
        message: "File uploaded successfully",
      });
    } catch (error) {
      console.error("Upload file error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file",
      });
    }
  };

  /**
   * Upload multiple files
   */
  public uploadMultipleFiles = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(400).json({
          success: false,
          error: "No files provided",
        });
        return;
      }

      const { contentType = "default" } = req.body;
      const folder = this.getFolderName(contentType);
      const files = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();

      const uploadPromises = files.map((file) =>
        this.storageService.uploadFile(file, folder),
      );
      const results = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        data: results,
        message: `${results.length} files uploaded successfully`,
      });
    } catch (error) {
      console.error("Upload multiple files error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload files",
      });
    }
  };

  /**
   * Delete a file
   */
  public deleteFile = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { fileUrl } = req.body;

      if (!fileUrl) {
        res.status(400).json({
          success: false,
          error: "File URL is required",
        });
        return;
      }

      await this.storageService.deleteFile(fileUrl);

      res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      console.error("Delete file error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete file",
      });
    }
  };

  /**
   * Get upload configuration
   */
  public getUploadConfig = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { contentType = "default" } = req.query;

      const allowedTypes = this.storageService.getAllowedFileTypes(
        contentType as string,
      );
      const maxSize = this.storageService.getMaxFileSize(contentType as string);

      res.status(200).json({
        success: true,
        data: {
          allowedTypes,
          maxSizeMB: maxSize,
          maxSizeBytes: maxSize * 1024 * 1024,
        },
      });
    } catch (error) {
      console.error("Get upload config error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get upload configuration",
      });
    }
  };

  /**
   * Get folder name based on content type
   */
  private getFolderName(contentType: string): string {
    const folderMap: Record<string, string> = {
      lesson: "lessons",
      fun: "fun-content",
      avatar: "avatars",
      default: "uploads",
    };

    return folderMap[contentType] || folderMap.default;
  }

  /**
   * Error handler for multer errors
   */
  public handleUploadError = (
    error: Error,
    req: Request,
    res: Response,
    _next: unknown,
  ): void => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          success: false,
          error: "File too large",
        });
        return;
      }
      if (error.code === "LIMIT_FILE_COUNT") {
        res.status(400).json({
          success: false,
          error: "Too many files",
        });
        return;
      }
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        res.status(400).json({
          success: false,
          error: "Unexpected file field",
        });
        return;
      }
    }

    if (error.message.includes("File type")) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      return;
    }

    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "File upload failed",
    });
  };
}
