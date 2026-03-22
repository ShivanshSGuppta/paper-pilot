import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../config/env";

const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 12 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
    const isText = file.mimetype === "text/plain" || file.mimetype === "application/octet-stream" || file.originalname.toLowerCase().endsWith(".txt");
    if (isPdf || isText) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF and text files are allowed."));
  }
});
