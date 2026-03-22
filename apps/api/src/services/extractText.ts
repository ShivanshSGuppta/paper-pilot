import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import { logger } from "../config/logger";

export type UploadedSource = {
  fileName?: string;
  fileType?: "pdf" | "txt";
  originalUploadPath?: string;
  buffer?: Buffer;
};

export async function extractTextFromUpload(source?: UploadedSource | null) {
  if (!source) {
    return {
      extractedText: "",
      fileName: null,
      fileType: null,
      originalUploadPath: null
    };
  }

  const fileName = source.fileName ?? null;
  const fileType = source.fileType ?? null;
  const originalUploadPath = source.originalUploadPath ?? null;

  try {
    if (source.buffer && fileType === "pdf") {
      const parsed = await pdfParse(source.buffer);
      return {
        extractedText: parsed.text.trim(),
        fileName,
        fileType,
        originalUploadPath
      };
    }

    if (source.buffer && fileType === "txt") {
      return {
        extractedText: source.buffer.toString("utf8").trim(),
        fileName,
        fileType,
        originalUploadPath
      };
    }

    if (originalUploadPath) {
      const absolute = path.resolve(originalUploadPath);
      const buffer = await fs.readFile(absolute);
      if (fileType === "pdf") {
        const parsed = await pdfParse(buffer);
        return {
          extractedText: parsed.text.trim(),
          fileName,
          fileType,
          originalUploadPath
        };
      }
      return {
        extractedText: buffer.toString("utf8").trim(),
        fileName,
        fileType,
        originalUploadPath
      };
    }
  } catch (error) {
    logger.error({ error }, "failed to extract upload text");
    throw new Error("Unable to extract text from uploaded file.");
  }

  return {
    extractedText: "",
    fileName,
    fileType,
    originalUploadPath
  };
}
